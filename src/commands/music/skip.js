import Command from '../../lib/structures/Command.js'

export default class Skip extends Command {
  constructor (client) {
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

  run () {
    this.player.stop()
    return '👍'
  }
}
