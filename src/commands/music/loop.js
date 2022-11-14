import Command from '../../lib/structures/Command.js'

export default class Loop extends Command {
  constructor (client) {
    super(client)
    this.name = 'loop'
    this.category = 'music'

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run ({ message, args, channel }) {
    if (!args[0]) return channel.send('Escolha entre `track`, `queue`, `off`')

    switch (args[0].toUpperCase()) {
      case 'TRACK':
        this.player.loop(1)
        message.react('🔂')
        break
      case 'QUEUE':
        this.player.loop(2)
        message.react('🔁')
        break
      case 'OFF':
        this.player.loop(0)
        message.react('⏯️')
        break
      default:
        message.react('🤔')
    }
  }
}
