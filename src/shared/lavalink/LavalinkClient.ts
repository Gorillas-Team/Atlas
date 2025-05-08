import { LavalinkNode, LavalinkNodeOptions } from './LavalinkNode.js'
import { pino, Logger } from 'pino'
import { LavalinkPlayer } from './LavalinkPlayer.js'

type LavalinkOptions = {
  clientId: string
  logLevel: string
  maxNodeReconnectAttempts?: number
}

export type LavalinkVoiceState = {
  guildId: string
  sessionId: string | null
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
  public join: (guildId: string, channelId: string) => void

  constructor(
    options: LavalinkOptions,
    nodes: LavalinkNodeOptions[],
    join: (guildId: string, channelId: string) => void
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

  public spawn(options: LavalinkVoiceState): LavalinkPlayer {
    const node = this.getBestNode()
    if (!node || !node.connected || !node.api) {
      throw new Error('No available Lavalink nodes')
    }

    if (!options.guildId || !options.voiceChannelId) {
      throw new Error('Guild ID and Voice Channel ID are required to spawn a player.')
    }

    const player = new LavalinkPlayer(options.guildId, node)
    this.players.set(options.guildId, player)
    return player
  }

  public updateVoiceState(userId: string, voiceState: LavalinkVoiceState) {
    this.voiceStates.set(userId, voiceState)
  }

  public updateVoiceServer(guildId: string, voiceServer: LavalinkVoiceServer) {
    this.voiceServers.set(guildId, voiceServer)
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
