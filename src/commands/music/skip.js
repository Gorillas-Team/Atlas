const Command = require('../../lib/structures/music/MusicCommand')

module.exports = class Skip extends Command {
  constructor(client) {
    super(client)
    this.name = 'skip'
    this.aliases = ['s', 'n']
    this.category = 'music'
    this.checkSameChannel = true
    this.checkPlaying = true
  }

  async musicRun({ message }) {
    this.player.stop()
    return message.react('👍')
  }
}