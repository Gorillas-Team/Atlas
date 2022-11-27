import Command from '../../lib/structures/Command.js'

export default class Pause extends Command {
  constructor (client) {
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

  run () {
    this.player.pause(true)
    return '⏸️'
  }
}
