const { Command } = require('../../lib/structures')

module.exports = class Skip extends Command {
  constructor(client) {
    super(client)
    this.name = 'skip'
    this.aliases = ['s', 'n']
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      memberTrack: true,
      playingOnly: true
    }
  }

  run({ message }) {
    this.player.stop()
    return message.react('👍')
  }
}