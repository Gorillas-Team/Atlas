export class LavalinkPlayer {
  private identifier: string | null
  private encodedTrack: string | null
  private startTime: number
  private endTime: number
  private volume: number
  private position: number
  private paused: boolean
  private filters: {
    equalizer: {
      band: number
      gain: number
    }[]
    karaoke: {
      level: number
      monoLevel: number
      filterBand: number
      filterWidth: number
    }
    timescale: {
      speed: number
      pitch: number
      rate: number
    }
    tremolo: {
      frequency: number
      depth: number
    }
    vibrato: {
      frequency: number
      depth: number
    }
    rotation: {
      rotationHz: number
    }
    distortion: {
      sinOffset: number
      sinScale: number
      cosOffset: number
      cosScale: number
      tanOffset: number
      tanScale: number
      offset: number
      scale: number
    }
    channelMix: {
      leftToLeft: number
      leftToRight: number
      rightToLeft: number
      rightToRight: number
    }
    lowPass: {
      smoothing: number
    }
  }
  public voice: {
    token: string | null
    endpoint: string | null
    sessionId: string | null
  }

  constructor() {
    this.identifier = null
    this.encodedTrack = null
    this.startTime = 0
    this.endTime = 0
    this.volume = 100
    this.position = 0
    this.paused = false
    this.filters = {
      equalizer: Array(15)
        .fill(0)
        .map((_, i) => ({ band: i, gain: 0 })),
      karaoke: {
        level: 1.0,
        monoLevel: 1.0,
        filterBand: 220.0,
        filterWidth: 100.0
      },
      timescale: {
        speed: 1.0,
        pitch: 1.0,
        rate: 1.0
      },
      tremolo: {
        frequency: 2.0,
        depth: 0.5
      },
      vibrato: {
        frequency: 2.0,
        depth: 0.5
      },
      rotation: {
        rotationHz: 0
      },
      distortion: {
        sinOffset: 0.0,
        sinScale: 1.0,
        cosOffset: 0.0,
        cosScale: 1.0,
        tanOffset: 0.0,
        tanScale: 1.0,
        offset: 0.0,
        scale: 1.0
      },
      channelMix: {
        leftToLeft: 1.0,
        leftToRight: 0.0,
        rightToLeft: 0.0,
        rightToRight: 1.0
      },
      lowPass: {
        smoothing: 20.0
      }
    }
    this.voice = {
      token: null,
      endpoint: null,
      sessionId: null
    }
  }

  public play() {
    if (this.encodedTrack === null) {
      throw new Error('No track is set to play')
    }

    this.paused = false
    this.position = 0
  }

  public pause() {
    this.paused = true
  }

  public stop() {
    this.position = 0
    this.paused = false
  }

  public setEncodedTrack(encodedTrack: string) {
    if (!encodedTrack) {
      throw new Error('Encoded track cannot be empty')
    }
    this.encodedTrack = encodedTrack
  }

  public setStartTime(startTime: number) {
    if (startTime < 0) {
      throw new Error('Start time cannot be negative')
    }
    this.startTime = startTime
  }

  public setEndTime(endTime: number) {
    if (endTime < 0) {
      throw new Error('End time cannot be negative')
    }

    if (endTime < this.startTime) {
      throw new Error('End time cannot be less than start time')
    }
    this.endTime = endTime
  }

  public setVolume(volume: number) {
    if (volume < 0 || volume > 1000) {
      throw new Error('Volume must be between 0 and 100')
    }
    this.volume = volume
  }

  public setPosition(position: number) {
    if (position < 0) {
      throw new Error('Position cannot be negative')
    }

    if (this.encodedTrack === null) {
      throw new Error('No track is set to play')
    }
    this.position = position
  }

  public setPaused(paused: boolean) {
    if (this.encodedTrack === null) {
      throw new Error('No track is set to play')
    }
    this.paused = paused
  }

  public setEqualizer(band: number, gain: number) {
    if (band < 0 || band > 14) {
      throw new Error('Band must be between 0 and 14')
    }

    if (gain < -0.25 || gain > 1) {
      throw new Error('Gain must be between -0.25 and 1')
    }

    this.filters.equalizer[band].gain = gain
  }
}
