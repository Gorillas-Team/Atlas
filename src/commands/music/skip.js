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

  async musicRun({ message, member, channel }) {
    if(this.player.track.requester.id !== member.id)
      return channel.send('Apenas o DJ e o requester tem permissão de pular a musica')

    this.player.stop()
    return message.react('👍')
  }
}