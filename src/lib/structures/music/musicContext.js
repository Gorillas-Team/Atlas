// TODO: pls Psykka from future, refactor this file

export default function musicContext ({ player, memberChannel, voiceChannel, conf, reply, ctx }) {
  const { me, member } = ctx
  const { needsPlayer, voiceChannelOnly, memberTrack, djOnly, playingOnly, checkPermissions } = conf

  if (needsPlayer && !player) return reply(':x: | Não estou tocando nada no momento')

  if (voiceChannelOnly && player && (!memberChannel || memberChannel !== voiceChannel)) {
    return reply(`:x: | Estou conectado em \`${client.channels.cache.get(voiceChannel.id || voiceChannel).name}\``)
  }

  if (djOnly) {
    if (memberTrack && (member.id !== player.track.requester.id && !player.isDJ(member))) {
      return reply(':x: | Somente o DJ e o requester tem permissão para isso')
    }

    if (!player.isDJ(member) && !memberTrack) return reply(':x: | Somente o DJ tem permissão para isso')
  }

  if (playingOnly && !player.playing) return reply(':x: | Não estou tocando nada no momento')

  if (checkPermissions) {
    if (!memberChannel) return reply(':x: | Você precisa estar conectado a um canal de voz para executar esse comando')
    if (!memberChannel.permissionsFor(me).has(1048576)) return reply(':x: | Não tenho permissão para me conectar ao canal')
    if (!memberChannel.permissionsFor(me).has(2097152)) return reply(':x: | Não tenho permissão para falar no canal')
  }
}
