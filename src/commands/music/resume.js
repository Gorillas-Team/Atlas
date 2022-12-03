import Command from '../../lib/structures/Command.js'

export default class Resume extends Command {
  constructor (client) {
    super(client)
    this.name = 'resume'
    this.aliases = ['unpause']
    this.category = 'music'
    this.description = 'Resumes the current song'
    this.react = true

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      playingOnly: true
    }
  }

  run () {
    this.player.pause(false)
    return '▶️'
  }
}
