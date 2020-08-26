const { Command } = require('../../lib/structures')

module.exports = class Resume extends Command {
  constructor(client) {
    super(client)
    this.name = 'resume'
    this.aliases ['unpause']
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run({ message }) {
    this.player.pause(false)
    return message.react('▶️')
  }
}