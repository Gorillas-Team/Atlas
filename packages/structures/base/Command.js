// import musicContext from './music/musicContext.js'

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
      playingOnly: false,
      checkPermissions: false
    }
  }

  async init (ctx) {
    this.ctx = ctx
    if (this.hidden && !this.client.config.owners.includes(ctx.author.id)) return

    try {
      if (Object.values(this.conf).includes(true)) {
        this.memberChannel = ctx.member.voice.channel
        this.player = this.client.music.players.get(ctx.guild.id)
        this.voiceChannel = this.client.channels.cache.get(this.player ? this.player.voiceChannel : null) || ctx.me.voice.channelId

        // const check = musicContext({
        //   player: this.player,
        //   memberChannel: this.memberChannel,
        //   voiceChannel: this.voiceChannel,
        //   conf: this.conf,
        //   reply: this.reply,
        //   client: this.client,
        //   ctx
        // })

        // if (check !== true) return
      }

      const message = await this.run(ctx)
      this.reply(ctx, message, this.react)
    } catch (err) {
      const anwser = 'Algo deu extremamente errado ao executar esse comando!'
      ctx.channel.send(anwser)
      console.error(err)
    }
  }

  reply (ctx, anwser, react = false) {
    const { channel, isInteraction, interaction, message } = ctx

    if (!anwser) return

    if (typeof anwser !== 'string' && typeof anwser !== 'object') {
      const typeofAnwser = typeof anwser
      anwser = `Algo deu errado ao executar esse comando!\n\`\`\`reply method only accepts string recived: ${typeofAnwser}\`\`\``
    }

    if (typeof anwser === 'object' && (!anwser.embeds && !anwser.content)) {
      anwser = 'Algo deu errado ao executar esse comando!\n```reply method only accepts object with embeds and content properties```'
    }

    if (react && !isInteraction) return message.react(anwser)
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
