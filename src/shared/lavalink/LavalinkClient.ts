import { LavalinkNode, LavalinkNodeOptions } from './LavalinkNode.js'
import { pino, Logger } from 'pino'
import { LavalinkPlayer, LavalinkPlayerVoice } from './LavalinkPlayer.js'

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
  private players: Map<string, LavalinkPlayer> = new Map()
  private voiceStates: Map<string, LavalinkVoiceState> = new Map()
  private voiceServers: Map<string, LavalinkVoiceServer> = new Map()
  private nodes: Map<string, LavalinkNode> = new Map()
  public join: (voiceState: LavalinkVoiceState) => void

  constructor(
    options: LavalinkOptions,
    nodes: LavalinkNodeOptions[],
    join: (voiceState: LavalinkVoiceState) => void
  ) {
    this.logger = pino({
      level: options.logLevel,
      name: 'Lavalink-Client'
    })

    this.clientId = options.clientId

    for (const nodeOptions of nodes) {
      this.addNode(nodeOptions)
    }

    this.join = join
  }

  public addNode(options: LavalinkNodeOptions) {
    const node = new LavalinkNode(this, options)
    node.connect()
    this.nodes.set(node.name, node)
    return node
  }

  public async spawn(options: LavalinkVoiceState) {
    const node = this.getBestNode()
    const { guildId, voiceChannelId } = options
    if (!node || !node.connected || !node.api) {
      throw new Error('No available Lavalink nodes')
    }

    if (!guildId || !voiceChannelId) {
      throw new Error('Guild ID and Voice Channel ID are required to spawn a player.')
    }

    const player = new LavalinkPlayer(options, node)
    this.players.set(guildId, player)
    await this.attemptConnect(guildId)
    return player
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

    this.join({
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

  getBestNode(): LavalinkNode {
    // TODO: Get best node based on CPU and memory data
    return Array.from(this.nodes.values())[0]
  }
}
