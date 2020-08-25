module.exports = function musicContext(options) {
  this.player = options.player
  this.memberChannel = options.memberChannel
  this.voiceChannel = options.voiceChannel

  this.conf = options.conf
  const { channel, member, me, client } = options.ctx

  if (this.conf.needsPlayer && !player) return channel.send(':x: | Não estou tocando nada no momento')

  if (this.conf.voiceChannelOnly && this.player && (!this.memberChannel || this.memberChannel !== this.voiceChannel)) {
    return channel.send(`:x: | Já estou conectado em \`${client.channels.cache.get(this.voiceChannel.id || this.voiceChannel).name}\``)
  }

  if (this.conf.djOnly && this.conf.memberTack && (member.id !== this.player.track.requester.id || !player.isDJ(member))) {
    return channel.send(':x: | Somente o DJ e o requester tem permissão para isso')
  }

  if (this.conf.djOnly && !player.isDJ(member)) {
    return channel.send(':x: | Somente o DJ tem permissão para isso')
  }

  if (this.conf.playingOnly && !this.player.playing) return channel.send(':x: | Não estou tocando nada no momento')

  if (this.conf.checkPermissions) {
    if (!this.memberChannel.permissionsFor(me).has(1048576)) return channel.send(':x: | Não tenho permissão para me conectar ao canal')
    if (!this.memberChannel.permissionsFor(me).has(2097152)) return channel.send(':x: | Não tenho permissão para falar no canal')
  }

  return options.command.run(options.ctx)
}