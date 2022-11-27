import Command from '../../lib/structures/Command.js'

export default class Play extends Command {
  constructor (client) {
    super(client)
    this.name = 'play'
    this.aliases = ['p']
    this.category = 'music'
    this.description = 'Play a song or add to the queue'
    this.options = [
      {
        type: 3,
        name: 'query',
        description: 'Nome da musica ou URL',
        required: true
      }
    ]

    this.conf = {
      voiceChannelOnly: true,
      checkPermissions: true
    }
  }

  async run ({ channel, member, guild, args, isInteraction, interaction, options }) {
    let query
    if (isInteraction) {
      query = options.getString('query')
    } else {
      if (!args[0]) return channel.send('Você precisa me dizer o nome da musica ou URL')
      query = args.join(' ')
    }

    const player = this.client.music.join({
      guild,
      voiceChannel: this.memberChannel,
      textChannel: channel
    })

    let searchMessage

    if (isInteraction) interaction = await interaction.reply({ content: `Procurando pelo video \`${query}\``, fetchReply: true })
    else searchMessage = await channel.send(`Procurando pelo video \`${query}\``)

    if (player.textChannel !== channel) player.textChannel = channel

    const msg = await this.client.music.musicSearchHandler({
      requester: member,
      query,
      player
    })

    if (isInteraction) await interaction.reply(msg)
    else await searchMessage.edit(msg)

    setTimeout(() => {
      if (msg.deletable && !isInteraction) msg.delete()
    }, 10000)

    if (!player.playing) {
      player.updateDj(guild)
      return player.play()
    }
  }
}
