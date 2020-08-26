const { Command } = require('../../lib/structures')
const { Queue } = require('gorilink')

module.exports = class Clean extends Command {
  constructor(client) {
    super(client)
    this.name = 'clear'
    this.aliases = ['clean', 'prune']
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true
    }
  }

  run({ message }) {
    this.player.queue = new Queue()
    return message.react('🗑️')
  }
}