// TODO: pls Psykka from future, refactor this file

export default function musicContext (options) {
  const player = options.player || null
  const memberChannel = options.memberChannel
  const voiceChannel = options.voiceChannel

  const conf = options.conf
  const { channel, member, me, client } = options.ctx

  if (conf.needsPlayer && !player) return channel.send(':x: | Não estou tocando nada no momento')

  if (conf.voiceChannelOnly && player && (!memberChannel || memberChannel !== voiceChannel)) {
    return channel.send(`:x: | Estou conectado em \`${client.channels.cache.get(voiceChannel.id || voiceChannel).name}\``)
  }

  if (conf.djOnly) {
    if (conf.memberTrack && (member.id !== player.track.requester.id && !player.isDJ(member))) {
      return channel.send(':x: | Somente o DJ e o requester tem permissão para isso')
    }

    if (!player.isDJ(member) && !conf.memberTrack) return channel.send(':x: | Somente o DJ tem permissão para isso')
  }

  if (conf.playingOnly && !player.playing) return channel.send(':x: | Não estou tocando nada no momento')

  if (conf.checkPermissions) {
    if (!memberChannel) return channel.send(':x: | Você precisa estar conectado a um canal de voz para executar esse comando')
    if (!memberChannel.permissionsFor(me).has(1048576)) return channel.send(':x: | Não tenho permissão para me conectar ao canal')
    if (!memberChannel.permissionsFor(me).has(2097152)) return channel.send(':x: | Não tenho permissão para falar no canal')
  }

  return options.command.run(options.ctx)
}
