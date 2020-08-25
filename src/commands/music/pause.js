const { Command } = require('../../lib/structures')

module.exports = class Pause extends Command {
  constructor(client) {
    super(client)
    this.name = 'pause'
    this.category = 'music'
    
    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run({ message }) {
    this.player.pause(true)
    return message.react('⏸️')
  }
}