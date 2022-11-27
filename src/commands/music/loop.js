import Command from '../../lib/structures/Command.js'

export default class Loop extends Command {
  constructor (client) {
    super(client)
    this.name = 'loop'
    this.category = 'music'
    this.options = [{
      type: 3,
      name: 'type',
      description: 'Tipo de loop',
      required: true,
      choices: [{
        name: 'Musica',
        value: 'TRACK'
      },
      {
        name: 'Fila',
        value: 'QUEUE'
      },
      {
        name: 'Desativar',
        value: 'OFF'
      }]
    }]

    this.conf = {
      needsPlayer: true,
      voiceChannelOnly: true,
      djOnly: true,
      playingOnly: true
    }
  }

  run ({ args, channel, isInteraction, options, interaction }) {
    let type

    if (isInteraction) {
      type = options.getString('type')
    } else {
      if (!args[0]) return channel.send('Você precisa me dizer o tipo de loop')
      type = args[0].toUpperCase()
    }

    switch (type.toUpperCase()) {
      case 'TRACK':
        this.player.loop(1)
        return '🔂'
      case 'QUEUE':
        this.player.loop(2)
        return '🔁'
      case 'OFF':
        this.player.loop(0)
        return '⏯️'
      default:
        return '🤔'
    }
  }
}
