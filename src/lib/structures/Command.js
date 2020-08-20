module.exports = class Command {
  constructor(client) {
    this.client = client
    this.name = null
    this.category = null
    this.description = null
    this.aliases = []
    this.hidden = false
    this.checks = []
  }

  init(ctx) {
    if (this.hidden && !this.client.config.owners.includes(ctx.author.id)) return

    try {
      if (this.checks.length >= 1) return this._checks(ctx, this.checks)
      this.run(ctx)
    } catch (err) {
      ctx.channel.send(`Algo deu extremamente errado ao executar esse comando por favor entrem em contato com a equipe de desenvolvimento usando o comando \`suport\` \`\`\`js\n${err}\`\`\``)
    }
  }

  run() { }

  _checks(ctx, checks) {
    this.memberChannel = ctx.member.voice.channel
    this.player = this.client.music.players.get(ctx.guild.id)
    this.voiceChannel = !this.player ? null : ctx.guild.channels.cache.get(this.player.voiceChannel) || this.player.voiceChannel

    if (!this.player) return this.run(ctx)

    if (checks.includes('voiceChannel') && !this.memberChannel)
      return ctx.channel.send('Você não esta em nenhum canal de voz')

    if (checks.includes('permission') && !this.voiceChannel.permissionsFor(ctx.me).has(3145728))
      return ctx.channel.send('Não tenho permissão para me conectar ou falar nesse canal')

    if (checks.includes('playing') && !this.voiceChannel)
      return ctx.channel.send('Não estou tocando nada')

    if (checks.includes('sameChannel') && this.memberChannel !== this.voiceChannel)
      return this.player.playing ? ctx.channel.send(`Já estou tocando musica em \`${ctx.me.voice.channel.name}\``) : this.musicRun(ctx)

    if (checks.includes('dj')
    && this.player.track.requester.id !== ctx.member.id
    && !(ctx.member.roles.cache.map(r => r.id).some(r => this.player.dj.includes(r)) && this.player.dj.includes(ctx.member.id))
    && !ctx.member.permissions.has(8))
      return ctx.channel.send('Apenas o DJ e o requester tem permissão de pular a musica')


    this.run(ctx)
  }
}