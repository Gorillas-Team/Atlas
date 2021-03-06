const { Command } = require('../../lib/structures')

module.exports = class Leave extends Command {
  constructor(client) {
    super(client)
    this.name = 'leave'
    this.aliases = ['l', 'disconnect']
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true
    }
  }

  run({ message }) {
    this.player.destroy()
    this.player.execClearTimeout()
    return message.react('👋')
  }
}