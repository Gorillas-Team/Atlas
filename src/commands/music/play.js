const { Command } = require('../../lib/structures')

module.exports = class Play extends Command {
  constructor(client) {
    super(client)
    this.name = 'play'
    this.aliases = ['p']
    this.category = 'music'

    this.conf = {
      voiceChannelOnly: true,
      checkPermissions: true
    }
  }

  async run({ channel, member, guild, args }) {
    if(!args[0]) return channel.send('Você precisa me dizer uma musica ou uma URL')

    const player = this.client.music.join({
      guild,
      voiceChannel: this.memberChannel,
      textChannel: channel
    })

    const query = args.join(' ')
    let msg = await channel.send(`Procurando pelo video \`${query}\``)

    if(player.textChannel !== channel) player.textChannel = channel

    msg = await this.client.music.musicSearchHandler({ query, requester: member, msg, player })
    msg.delete({ timeout: 10000 })

    if(!player.playing) {
      player.updateDj(guild)
      return player.play()
    }
  }
}