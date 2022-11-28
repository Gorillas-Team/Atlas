import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'queueEnd',
      type: 'lavalink'
    })
  }

  run (player) {
    if (player.lastMessage && !player.lastMessage.deletable) player.lastMessage.then(m => m.delete())
    player.textChannel.send('A fila acabou, saindo do canal de voz em breve')
    player.execTimeout()
  }
}
