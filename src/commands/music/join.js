const { Command } = require('../../lib/structures')

module.exports = class Join extends Command {
  constructor(client) {
    super(client)
    this.name = 'join'
    this.aliases = ['connect', 'j']
    this.category = 'music'
    this.checks = ['voiceChannel', 'sameChannel']
  }

  run({ message, guild, channel }) {
    const player = this.client.music.join({
      guild,
      voiceChannel: this.memberChannel,
      textChannel: channel
    })

    player.execTimeout()
    return message.react('👌')
  }
}