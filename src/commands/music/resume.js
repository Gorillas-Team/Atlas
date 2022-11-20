import Command from '../../lib/structures/Command.js'

export default class Resume extends Command {
  constructor (client) {
    super(client)
    this.name = 'resume'
    this.aliases = ['unpause']
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run ({ message }) {
    this.player.pause(false)
    return message.react('▶️')
  }
}
