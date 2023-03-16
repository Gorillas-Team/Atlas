// TODO: update gorilink to ES Modules
import gorilink from 'gorilink'
const { GorilinkPlayer } = gorilink

export default class AtlasPlayer extends GorilinkPlayer {
  constructor (node, options, manager) {
    super(node, options, manager)
    this.channelEmpty = false
    this.leaveTimeout = this.manager.client.config.leaveTimeout || 180000
    this.previousTrack = null
  }

  destroy () {
    super.destroy()
    this.manager.updateStats()
    console.log('[LAVALINK] Player destroyed at:', this.guild.id || this.guild)
  }

  updateChannel (newChannel) {
    if (!newChannel) return
    this.voiceChannel = newChannel
  }

  execTimeout () {
    if (this._leaveTimeout) return

    this._leaveTimeout = setTimeout(() => {
      this.textChannel.send('😴 Saindo do canal por inatividade')
      this.destroy()
    }, this.leaveTimeout)
  }

  execClearTimeout () {
    if (this._leaveTimeout) {
      clearTimeout(this._leaveTimeout)
      delete this._leaveTimeout
    }
  }
}
