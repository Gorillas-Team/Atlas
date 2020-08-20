const { Command } = require('../../lib/structures')
const { Queue } = require('gorilink')

module.exports = class Stop extends Command {
  constructor(client) {
    super(client)
    this.name = 'stop'
    this.category = 'music'
    this.checks = ['playing', 'sameChannel', 'dj']
  }

  run({ message }) {
    this.player.queue = new Queue()
    this.player.stop()
    return message.react('🛑')
  }
}