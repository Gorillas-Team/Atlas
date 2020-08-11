const Command = require('../Command')

module.exports = class MusicCommand extends Command {
  constructor(client) {
    super(client)
    this.checkVoiceMember = false
    this.checkPlaying = false
    this.checkSameChannel = false

    this.player = null
    this.memberChannel = null
    this.voiceChannel = null
  }

  run(ctx) {
    this.memberChannel = ctx.member.voice.channel
    this.player = this.client.music.players.get(ctx.guild.id)
    this.voiceChannel = !this.player ? null : this.player.voiceChannel

    if (this.checkVoiceMember && !this.memberChannel) {
      return ctx.channel.send('Você não esta em nenhum canal de voz')
    }

    if (this.checkPlaying && !this.voiceChannel) {
      return ctx.channel.send('Não estou tocando nada')
    }

    if(!this.player) return this.musicRun(ctx)

    if(this.checkSameChannel && this.memberChannel !== ctx.me.voice.channel) {
      return this.player.playing ? ctx.channel.send(`Já estou tocando musica em \`${ctx.me.voice.channel.name}\``) : this.musicRun(ctx)
    }

    this.musicRun(ctx)
  }

  musicRun() { }
}