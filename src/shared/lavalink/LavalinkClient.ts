import { LavalinkNode, LavalinkNodeOptions } from './LavalinkNode.js'
import { pino, Logger } from 'pino'
import { LavalinkPlayer, LavalinkPlayerVoice } from './LavalinkPlayer.js'
import { LavalinkTrack, LoadTracksResponse, TrackEndReason } from './LavalinkPackets.js'

type LavalinkOptions = {
  clientId: string
  logLevel: string
  maxNodeReconnectAttempts?: number
}

export type LavalinkVoiceState = {
  guildId: string
  sessionId?: string
  voiceChannelId: string | null
  selfDeaf?: boolean
  selfMute?: boolean
}

export type LavalinkVoiceServer = {
  token: string
  endpoint: string
}

export class LavalinkClient {
  public logger: Logger
  public clientId: string
  public players: Map<string, LavalinkPlayer> = new Map()
  private voiceStates: Map<string, LavalinkVoiceState> = new Map()
  private voiceServers: Map<string, LavalinkVoiceServer> = new Map()
  private nodes: Map<string, LavalinkNode> = new Map()
  public voiceState: (voiceState: LavalinkVoiceState) => void

  constructor(
    options: LavalinkOptions,
    nodes: LavalinkNodeOptions[],
    voiceState: (voiceState: LavalinkVoiceState) => void
  ) {
    this.logger = pino({
      level: options.logLevel,
      name: 'Lavalink-Client'
    })

    this.clientId = options.clientId

    for (const nodeOptions of nodes) {
      this.addNode(nodeOptions)
    }

    this.voiceState = voiceState
  }

  public addNode(options: LavalinkNodeOptions) {
    const node = new LavalinkNode(this, options)
    node.connect()
    this.nodes.set(node.name, node)
    return node
  }

  public async spawn(options: LavalinkVoiceState) {
    let player = this.players.get(options.guildId)
    if (player) {
      return player
    }

    const node = this.getBestNode()
    const { guildId, voiceChannelId } = options
    if (!node || !node.connected || !node.api) {
      throw new Error('No available Lavalink nodes')
    }

    if (!guildId || !voiceChannelId) {
      throw new Error('Guild ID and Voice Channel ID are required to spawn a player.')
    }

    player = new LavalinkPlayer(options, node)
    this.players.set(guildId, player)
    await this.attemptConnect(guildId)
    return player
  }

  public trackStart(guildId: string, track: LavalinkTrack) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    this.logger.debug(`Playing track: ${track.info.title}`)
  }

  public async trackEnd(guildId: string, track: LavalinkTrack, reason: TrackEndReason) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    if (reason == 'replaced' && player.queue.length == 0) {
      return await this.destroy(guildId)
    }

    if (player.queue.length <= 1) {
      player.queue.shift()
      player.state.paused = true
      if (['finished', 'cleanup'].includes(reason)) {
        await this.destroy(guildId)
      }

      return
    }

    if (player.queue.length > 0) {
      player.queue.shift()
      await player.play()

      this.logger.debug(`Playing next track: ${player.queue[0].info.title}`)
      return
    }
  }

  async destroy(guildId: string) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    await player.destroy()
    this.voiceState({ voiceChannelId: null, guildId: guildId })

    this.players.delete(guildId)
  }

  private loadTracks(response: LoadTracksResponse, search: boolean = false): LavalinkTrack[] {
    if (response.loadType === 'track') {
      return [response.data]
    }

    if (response.loadType === 'playlist') {
      return response.data.tracks
    }

    if (response.loadType === 'search') {
      if (search) {
        return response.data
      }

      return [response.data[0]]
    }

    if (response.loadType === 'empty' || response.loadType === 'error') {
      return []
    }

    return []
  }

  public async findTracks(query: string, source: string, search = false): Promise<LavalinkTrack[]> {
    const node = this.getBestNode()
    if (!node || !node.api) {
      throw new Error('No available Lavalink nodes')
    }

    const response = await node.api.fetchTracks(query, source)
    if (!response) {
      throw new Error('No tracks found')
    }

    const tracks = this.loadTracks(response, search)

    return tracks
  }

  private async attemptConnect(guildId: string, playerVoice?: Partial<LavalinkPlayerVoice>) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    // TODO: handle channel switches
    if (player.connected) return

    const playerStateVoice = player.state.voice

    player.setVoice({
      ...playerStateVoice,
      ...playerVoice
    })

    this.voiceState({
      guildId: player.guildId,
      voiceChannelId: player.channelId ?? null,
      selfDeaf: player.selfDeaf,
      selfMute: player.selfMute
    })

    await player.connect()
  }

  public async updateVoiceState(userId: string, voiceState: LavalinkVoiceState) {
    this.voiceStates.set(userId, voiceState)
    await this.attemptConnect(voiceState.guildId, {
      sessionId: voiceState.sessionId
    })
  }

  public async updateVoiceServer(guildId: string, voiceServer: LavalinkVoiceServer) {
    this.voiceServers.set(guildId, voiceServer)
    await this.attemptConnect(guildId, {
      token: voiceServer.token,
      endpoint: voiceServer.endpoint
    })
  }

  public deleteVoiceState(userId: string) {
    this.voiceStates.delete(userId)
  }

  public deleteVoiceServer(guildId: string) {
    this.voiceServers.delete(guildId)
  }

  public getVoiceState(userId: string): LavalinkVoiceState | undefined {
    return this.voiceStates.get(userId)
  }

  public getVoiceServer(guildId: string): LavalinkVoiceServer | undefined {
    return this.voiceServers.get(guildId)
  }

  public getBestNode(): LavalinkNode {
    // TODO: Get best node based on CPU and memory data
    return Array.from(this.nodes.values())[0]
  }
}
