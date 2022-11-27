import musicContext from './music/musicContext.js'

export default class Command {
  constructor (client) {
    this.client = client
    this.name = null
    this.category = null
    this.description = null
    this.aliases = []
    this.hidden = false
    this.options = {}
    this.react = false
    this.ctx = {}

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
    this.ctx = ctx
    if (this.hidden && !this.client.config.owners.includes(ctx.author.id)) return

    try {
      if (Object.values(this.conf).includes(true)) {
        this.memberChannel = await ctx.guild.channels.fetch(ctx.member.voice.channelId)
        this.player = this.client.music.players.get(ctx.guild.id)
        this.voiceChannel = this.client.channels.cache.get(this.player ? this.player.voiceChannel : null) || ctx.me.voice.channelId

        musicContext({
          player: this.player,
          memberChannel: this.memberChannel,
          voiceChannel: this.voiceChannel,
          conf: this.conf,
          reply: this.reply,
          ctx
        })
      }

      const message = await this.run(ctx)
      this.reply(message, this.react)

    } catch (err) {
      const anwser = `Algo deu extremamente errado ao executar esse comando por favor entrem em contato com a equipe de desenvolvimento usando o comando \`support\``
      this.reply(anwser)
      console.error(err)
    }
  }

  reply (anwser, react = false) {
    const { channel, isInteraction, interaction, message } = this.ctx

    if (!anwser) return
    if(react && !isInteraction) return message.react(anwser)
    isInteraction ? interaction.reply(anwser) : channel.send(anwser)
  }

  /**
   * @param {object} ctx
   * @returns {string} anwser to send
   */
  run () {
    throw new Error(`${this.name} run method not implemented`)
  }
}