import Command from '../../lib/structures/Command.js'
import gorilink from 'gorilink'
const { Queue } = gorilink

export default class Stop extends Command {
  constructor (client) {
    super(client)
    this.name = 'stop'
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run () {
    this.player.queue = new Queue()
    this.player.stop()
    return '🛑'
  }
}
