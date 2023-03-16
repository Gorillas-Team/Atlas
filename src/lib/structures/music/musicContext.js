// TODO: pls Psykka from future, refactor this file

export default function musicContext ({ player, memberChannel, voiceChannel, conf, reply, ctx, client }) {
  const { me } = ctx
  const { needsPlayer, voiceChannelOnly, playingOnly, checkPermissions } = conf

  if (needsPlayer && !player) return reply(ctx, ':x: | Não estou tocando nada no momento')

  if (voiceChannelOnly && player && (!memberChannel || memberChannel !== voiceChannel)) {
    return reply(ctx, `:x: | Estou conectado em \`${client.channels.cache.get(voiceChannel.id || voiceChannel).name}\``)
  }

  if (playingOnly && !player.playing) return reply(ctx, ':x: | Não estou tocando nada no momento')

  if (checkPermissions) {
    if (!memberChannel) return reply(ctx, ':x: | Você precisa estar conectado a um canal de voz para executar esse comando')
    if (!memberChannel.permissionsFor(me).has(1048576)) return reply(ctx, ':x: | Não tenho permissão para me conectar ao canal')
    if (!memberChannel.permissionsFor(me).has(2097152)) return reply(ctx, ':x: | Não tenho permissão para falar no canal')
  }

  return true
}
