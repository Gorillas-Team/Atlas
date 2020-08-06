const Command = require('../../lib/structures/Command')

module.exports = class Skip extends Command {
  constructor(client) {
    super(client)
    this.name = 'skip'
    this.aliases = ['s', 'n']
    this.category = 'music'
  }

  async run({ message, guild, channel }) {
    const player = this.client.music.players.get(guild.id)
    if(!player) return channel.send('Não estou tocando nada no momento!')
    player.stop()
    return message.react('👍')
  }
}