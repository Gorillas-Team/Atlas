const { GorilinkPlayer } = require('gorilink')

module.exports = class AtlasPlayer extends GorilinkPlayer {
  constructor(node, options, manager) {
    super(node, options, manager)
    this.channelEmpty = false
    this.dj = null
    this.leaveTimeout = this.manager.client.config.leaveTimeout || 180000
    this.previousTrack = null
  }

  updateDj(guild) {
    // database soon
    let djRole = guild.roles.cache.filter(g => g.name.toUpperCase().includes('DJ')).first()

    if(!djRole) {
      djRole = this.queue[0].requester
      this.textChannel.send(`:information_source: | Não encontrei nenhum cargo de DJ no servidor, por tanto o DJ atualmente é ${djRole}`)
    }

    return this.dj = djRole
  }

  isDJ(member){
    return member.roles.cache.has(this.dj.id) || member.id === this.dj.id || member.permissions.has(16) ? true : false
  }

  updateChannel(newChannel) {
    return this.voiceChannel = newChannel.id
  }

  execTimeout() {
    if (this._leaveTimeout) this.execClearTimeout()
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