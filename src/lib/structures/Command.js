import musicContext from './music/musicContext.js'

export default class Command {
  constructor (client) {
    this.client = client
    this.name = null
    this.category = null
    this.description = null
    this.aliases = []
    this.hidden = false

    this.conf = {
      needsPlayer: false,
      voiceChannelOnly: false,
      memberTrack: false,
      djOnly: false,
      playingOnly: false,
      checkPermissions: false
    }
  }

  async init (ctx) {
    if (this.hidden && !this.client.config.owners.includes(ctx.author.id)) return

    try {
      if (Object.values(this.conf).includes(true)) {
        this.memberChannel = await ctx.guild.channels.fetch(ctx.member.voice.channelId)
        this.player = this.client.music.players.get(ctx.guild.id)
        this.voiceChannel = this.client.channels.cache.get(this.player ? this.player.voiceChannel : null) || ctx.me.voice.channelId

        return musicContext({
          player: this.player,
          memberChannel: this.memberChannel,
          voiceChannel: this.voiceChannel,
          conf: this.conf,
          ctx,
          command: this
        })
      }

      this.run(ctx)
    } catch (err) {
      ctx.channel.send(`Algo deu extremamente errado ao executar esse comando por favor entrem em contato com a equipe de desenvolvimento usando o comando \`support\` \`\`\`js\n${err}\`\`\``)
      console.error(err)
    }
  }

  run () { }
}
