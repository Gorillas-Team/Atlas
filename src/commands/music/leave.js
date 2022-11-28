import Command from '../../lib/structures/Command.js'

export default class Leave extends Command {
  constructor (client) {
    super(client)
    this.name = 'leave'
    this.aliases = ['l', 'disconnect']
    this.category = 'music'
    this.react = true
    this.description = 'Leaves the voice channel'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true
    }
  }

  run () {
    this.player.destroy()
    this.player.execClearTimeout()
    return '👋'
  }
}
