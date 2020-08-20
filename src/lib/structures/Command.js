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
    this.voiceChannel = ctx.me.voice.channel

    if (checks.includes('voiceChannel') && !this.memberChannel)
      return ctx.channel.send('Você está em nenhum canal de voz')

    if (checks.includes('connected') && !this.voiceChannel)
      return ctx.channel.send('Não estou conectado há nenhum canal')

    if (!this.player) return this.run(ctx)
    const track = this.player.track ? this.player.track : null

    if(checks.includes('playing') && !this.player.playing)
      return ctx.channel.send('Não estou tocando nada no momento')

    if (checks.includes('sameChannel') && this.memberChannel !== this.voiceChannel)
      return this.player.playing ?
        ctx.channel.send(`Já estou tocando musica em \`${this.voiceChannel.name}\``) :
        ctx.channel.send(`Estou conectado em \`${this.voiceChannel.name}\``)

    if (checks.includes('permission') && !this.voiceChannel.permissionsFor(ctx.me).has(3145728))
      return ctx.channel.send('Não tenho permissão para me conectar ou falar nesse canal')

    if (checks.includes('dj')
      && track.requester ? track.requester.id !== ctx.member.id : true
      && !(ctx.member.roles.cache.map(r => r.id).some(r => this.player.dj.includes(r)) && this.player.dj.includes(ctx.member.id))
      && !ctx.member.permissions.has(32))
      return ctx.channel.send('Apenas o DJ e o requester tem permissão de fazer isso')


    this.run(ctx)
  }
}