import { LavalinkTrack } from '@/shared/lavalink/LavalinkPackets.js'
import { LavalinkNode } from './LavalinkNode.js'
import { LavalinkApi } from './LavalinkApi.js'
import { LavalinkClient, LavalinkVoiceState } from './LavalinkClient.js'
import { TextChannel } from 'discord.js'

export type LavalinkPlayerVoice = {
  token: string | null
  endpoint: string | null
  sessionId: string | null
}

export type LavalinkPlayerState = {
  track?: LavalinkTrack
  position: number
  endTime?: number
  volume: number
  paused: boolean
  filters: {
    equalizer?: { band: number; gain: number }[]
    karaoke?: { level: number; monoLevel: number; filterBand: number; filterWidth: number }
    timescale?: { speed: number; pitch: number; rate: number }
    tremolo?: { frequency: number; depth: number }
    vibrato?: { frequency: number; depth: number }
    rotation?: { rotationHz: number }
    distortion?: {
      sinOffset: number
      sinScale: number
      cosOffset: number
      cosScale: number
      tanOffset: number
      tanScale: number
      offset: number
      scale: number
    }
    channelMix?: {
      leftToLeft: number
      leftToRight: number
      rightToLeft: number
      rightToRight: number
    }
    lowPass?: { smoothing: number }
  }
  voice: LavalinkPlayerVoice
}

export class LavalinkPlayer {
  public node: LavalinkNode
  public client: LavalinkClient
  public api: LavalinkApi | null = null
  public sessionId: string | null = null
  public channelId: string | null = null
  public guildId: string
  public selfDeaf: boolean = true
  public selfMute: boolean = false
  public connected: boolean = false
  public queue: LavalinkTrack[]
  public state: LavalinkPlayerState
  public time: number = -1
  public ping: number = -1
  public textChannel: TextChannel | null = null
  public lastNowplayingId: string | null = null

  constructor(options: LavalinkVoiceState, node: LavalinkNode, client: LavalinkClient) {
    this.node = node
    this.client = client
    this.api = node.api
    this.sessionId = node.sessionId
    this.channelId = options.voiceChannelId
    this.guildId = options.guildId
    this.selfDeaf = options.selfDeaf ?? true
    this.selfMute = options.selfMute ?? false
    this.queue = []
    this.state = {
      position: 0,
      volume: 100,
      paused: true,
      filters: {},
      voice: {
        token: null,
        endpoint: null,
        sessionId: null
      }
    }
  }

  private async updatePlayerState(onReplace: boolean = true) {
    if (!this.connected) return

    if (!this.api || !this.sessionId || !this.guildId) {
      throw new Error('API, session ID, or guild ID is missing')
    }

    await this.api.updatePlayer(this.sessionId, this.guildId, this.state, onReplace)
  }

  public async connect() {
    const { token, endpoint, sessionId } = this.state.voice
    if (!token || !endpoint || !sessionId) return
    this.connected = true
    await this.updatePlayerState()
  }

  public async play(noReplace: boolean = true) {
    const track = this.queue[0]

    if (!track) {
      throw new Error('No track to play')
    }

    this.state.track = track
    this.state.position = 0
    this.state.paused = false

    await this.updatePlayerState(noReplace)
  }

  public async stop() {
    this.state.paused = true
    this.state.track = undefined
    this.state.position = 0

    if (this.queue.length > 1) {
      this.queue.shift()
      return await this.play(false)
    }

    void this.client.destroy(this.guildId)
  }

  public addTrack(track: LavalinkTrack[]) {
    if (!track) {
      throw new Error('Track is required')
    }

    this.queue.push(...track)
  }

  public setTextChannel(channel: TextChannel) {
    if (!channel) {
      throw new Error('Text channel is required')
    }

    this.textChannel = channel
  }

  public setLastNowplayingId(id: string) {
    if (!id) {
      throw new Error('ID is required')
    }

    this.lastNowplayingId = id
  }

  public deleteLastNowplayingId() {
    if (this.lastNowplayingId && this.textChannel) {
      void this.textChannel.messages.delete(this.lastNowplayingId)
    }
  }

  public setVoice(voiceServer: Partial<LavalinkPlayerVoice>) {
    this.state.voice = {
      ...this.state.voice,
      ...voiceServer
    }
  }
}
