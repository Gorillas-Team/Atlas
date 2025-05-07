import { LavalinkNode, LavalinkNodeOptions } from './LavalinkNode.js'
import { pino, Logger } from 'pino'
import { LavalinkPlayer } from './LavalinkPlayer.js'

type LavalinkOptions = {
  clientId: string
  logLevel: string
  maxNodeReconnectAttempts?: number
}

type LavalinkVoiceState = {
  guildId: string
  voiceChannelId: string
  selfDeaf?: boolean
  selfMute?: boolean
}

type LavalinkVoiceServer = {
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

  constructor(options: LavalinkOptions, nodes: LavalinkNodeOptions[]) {
    this.logger = pino({
      level: options.logLevel,
      name: 'Lavalink-Client'
    })

    this.clientId = options.clientId

    for (const nodeOptions of nodes) {
      this.addNode(nodeOptions)
    }
  }

  public addNode(options: LavalinkNodeOptions) {
    const node = new LavalinkNode(this, options)
    node.connect()
    this.nodes.set(node.name, node)
    return node
  }

  public async spawn(options: LavalinkVoiceState) {
    const node = this.getBestNode()
    if (!node || !node.connected || !node.api) {
      throw new Error('No available Lavalink nodes')
    }

    const player = new LavalinkPlayer()
    const updatedPlayer = await node.api.updatePlayer(node.sessionId!, options.guildId, player)
    this.players.set(options.guildId, updatedPlayer)
  }

  public updateVoiceState(guildId: string, voiceState: LavalinkVoiceState) {
    this.voiceStates.set(guildId, voiceState)
  }

  public updateVoiceServer(guildId: string, voiceServer: LavalinkVoiceServer) {
    this.voiceServers.set(guildId, voiceServer)
  }

  public getVoiceState(guildId: string): LavalinkVoiceState | undefined {
    return this.voiceStates.get(guildId)
  }

  public getVoiceServer(guildId: string): LavalinkVoiceServer | undefined {
    return this.voiceServers.get(guildId)
  }

  getBestNode(): LavalinkNode {
    // TODO: Get best node based on CPU and memory data
    return Array.from(this.nodes.values())[0]
  }
}
