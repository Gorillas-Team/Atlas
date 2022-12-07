import Command from '../../lib/structures/Command.js'

export default class Clean extends Command {
  constructor (client) {
    super(client)
    this.name = 'clear'
    this.aliases = ['clean', 'prune']
    this.category = 'music'
    this.react = true
    this.description = 'Clears the queue'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true
    }
  }

  run () {
    this.player.queue = this.player.queue.splice(0, 1)
    return '🗑️'
  }
}
