import { LavalinkNode, type LavalinkNodeOptions } from './LavalinkNode.js'
import { pino, type Logger } from 'pino'
import { LavalinkPlayer, type LavalinkPlayerVoice } from './LavalinkPlayer.js'
import type {
  LavalinkTrack,
  LoadTracksResponse,
  PlayerState,
  TrackEndReason,
} from './LavalinkPackets.js'
import type { UUID } from 'node:crypto'
import { t } from '../i18n/i18n.js'
import { Duration } from 'luxon'
import { TextChannel } from 'discord.js'

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
  private nodes: Map<UUID, LavalinkNode> = new Map()
  public voiceState: (voiceState: LavalinkVoiceState) => void

  constructor(
    options: LavalinkOptions,
    nodes: LavalinkNodeOptions[],
    voiceState: (voiceState: LavalinkVoiceState) => void,
  ) {
    this.logger = pino({
      level: options.logLevel,
      name: 'Lavalink-Client',
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
    this.nodes.set(node.id, node)
    return node
  }

  public async spawn(options: LavalinkVoiceState, channel: TextChannel) {
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

    player = new LavalinkPlayer(options, node, this)
    player.setTextChannel(channel)
    this.players.set(guildId, player)
    await this.attemptConnect(guildId)
    return player
  }

  public updatePlayer(guildId: string, state: PlayerState) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    player.state.position = state.position
    player.connected = state.connected
    player.time = state.time
    player.ping = state.ping
  }

  public async trackStart(guildId: string, track: LavalinkTrack) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    const { title, length } = track.info
    this.logger.debug(`Playing track: ${title}`)
    const duration = Duration.fromMillis(length).toFormat('mm:ss')

    if (!player.textChannel) {
      return this.logger.warn('No text channel available')
    }

    const msg = await player.textChannel.send({
      content: t('command.play.playingNow', { title, duration }),
      flags: ['SuppressNotifications'],
    })

    player.setLastNowplayingId(msg.id)
  }

  public async trackEnd(guildId: string, track: LavalinkTrack, reason: TrackEndReason) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.debug(`Player not found for guild ID: ${guildId}`)

    this.logger.debug(`Track ended, reason={${reason}}; track={${track.info.title}}`)

    player.deleteLastNowplayingId()

    if (['finished', 'stopped'].includes(reason) && player.queue.length == 1) {
      return await this.destroy(guildId)
    }

    if (['finished'].includes(reason) && player.queue.length > 1) {
      player.queue.shift()
      await player.play()
      this.logger.debug(`Playing next track: ${player.queue[0]?.info.title ?? 'Unknown'}`)
      return
    }
  }

  async destroy(guildId: string) {
    const player = this.players.get(guildId)
    if (!player) return this.logger.warn(`Player not found for guild ID: ${guildId}`)

    const node = this.nodes.get(player.node.id)
    if (!node || !node.api || !node.sessionId) {
      return this.logger.warn(`Node not found for player ID: ${player.node.id}`)
    }

    await node.api.destroyPlayer(node.sessionId, guildId)
    this.voiceState({ voiceChannelId: null, guildId: guildId })

    this.players.delete(guildId)
  }

  private loadTracks(response: LoadTracksResponse, search: boolean = false): LavalinkTrack[] {
    this.logger.debug(`load type: ${response.loadType}`)

    if (response.loadType === 'track') {
      return [response.data]
    }

    if (response.loadType === 'playlist') {
      return response.data.tracks
    }

    if (response.loadType === 'search') {
      if (search && response.data.length > 1) {
        return response.data
      }

      return response.data.slice(0, 1)
    }

    if (response.loadType === 'empty' || response.loadType === 'error') {
      return []
    }

    return []
  }

  public async findTracks(
    query: string,
    source?: string,
    search = false,
  ): Promise<LavalinkTrack[]> {
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
      ...playerVoice,
    })

    this.voiceState({
      guildId: player.guildId,
      voiceChannelId: player.channelId ?? null,
      selfDeaf: player.selfDeaf,
      selfMute: player.selfMute,
    })

    await player.connect()
  }

  public async updateVoiceState(userId: string, voiceState: LavalinkVoiceState) {
    this.voiceStates.set(userId, voiceState)
    await this.attemptConnect(voiceState.guildId, {
      sessionId: voiceState.sessionId,
    })
  }

  public async updateVoiceServer(guildId: string, voiceServer: LavalinkVoiceServer) {
    this.voiceServers.set(guildId, voiceServer)
    await this.attemptConnect(guildId, {
      token: voiceServer.token,
      endpoint: voiceServer.endpoint,
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

  public getBestNode(): LavalinkNode | null {
    // TODO: Get best node based on CPU and memory data
    return Array.from(this.nodes.values()).find((node: LavalinkNode) => node.connected) ?? null
  }
}
