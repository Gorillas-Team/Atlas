const { GorilinkPlayer } = require('gorilink')

module.exports = class AtlasPlayer extends GorilinkPlayer {
  constructor(node, options, manager) {
    super(node, options, manager)
    this.channelEmpty = false
    this.dj = []
    this.leaveTimeout = this.manager.client.config.leaveTimeout || 180000
    this.previousTrack = null
  }

  updateDj(guild) {
    const findRoles = guild.roles.cache.filter(g => g.name.toUpperCase().includes('DJ')).array().map(r => r.id)
    const dbPerms = []

    const perms = [...this.dj, ...dbPerms, ...findRoles]

    return this.dj = perms.filter((index, p) => perms.indexOf(index) === p)
  }

  updateChannel(newChannel) {
    return this.voiceChannel = newChannel.id
  }

  execTimeout() {
    if(this._leaveTimeout) this.execClearTimeout()
    this._leaveTimeout = setTimeout(() => {
      if (this.playing && !this.channelEmpty) return
      this.textChannel.send('😴 Saindo do canal por inatividade')
      this.destroy()
    }, this.leaveTimeout)
  }

  execClearTimeout() {
    if (this._leaveTimeout) {
      clearTimeout(this._leaveTimeout)
      delete this._leaveTimeout
    }
  }
}