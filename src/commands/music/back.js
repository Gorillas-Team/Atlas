const { Command } = require('../../lib/structures')

module.exports = class Back extends Command {
  constructor(client) {
    super(client)
    this.name = 'back'
    this.category = 'music'
    this.aliases = ['b']

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true
    }
  }

  async run({ message, channel }) {
    if(!this.player || !this.player.previousTrack) return channel.send('Não toquei nada recentemente')
    this.player.queue.unshift(this.player.previousTrack)
    this.player.play()
    return message.react('⏪')
  }
}
