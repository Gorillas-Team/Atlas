import { LavalinkTrack } from '@/shared/lavalink/LavalinkPackets.js'
import { LavalinkNode } from './LavalinkNode.js'

type LavalinkPlayerVoice = {
  token: string | null
  endpoint: string | null
  sessionId: string | null
}

export type LavalinkPlayerState = {
  track: LavalinkTrack | null
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
  voice?: LavalinkPlayerVoice
}

export class LavalinkPlayer {
  public node: LavalinkNode
  public guildId: string
  public state: LavalinkPlayerState
  public queue: LavalinkTrack[]

  constructor(guildId: string, LavalinkNode: LavalinkNode) {
    this.node = LavalinkNode
    this.guildId = guildId
    this.queue = []
    this.state = {
      track: null,
      position: 0,
      volume: 100,
      paused: false,
      filters: {}
    }
  }

  public setVoice(voiceServer: LavalinkPlayerVoice) {
    if (!voiceServer.token || !voiceServer.endpoint || !voiceServer.sessionId) {
      throw new Error('Voice server information is incomplete')
    }

    this.state.voice = voiceServer
  }
}
