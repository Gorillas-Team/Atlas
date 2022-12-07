import Command from '../../lib/structures/Command.js'

export default class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'skip'
    this.aliases = ['s', 'n']
    this.category = 'music'
    this.description = 'Skips the current song'
    this.react = true

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      memberTrack: true,
      playingOnly: true
    }
  }

  run () {
    this.player.stop()
    return '👍'
  }
}
