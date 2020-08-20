const { Command } = require('../../lib/structures')

module.exports = class Pause extends Command {
  constructor(client) {
    super(client)
    this.name = 'pause'
    this.category = 'music'
    this.checks = ['connected', 'playing', 'sameChannel', 'dj']
  }

  run({ message }) {
    this.player.pause(true)
    return message.react('⏸️')
  }
}