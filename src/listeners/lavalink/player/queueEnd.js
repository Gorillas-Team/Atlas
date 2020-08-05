const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'queueEnd',
      type: 'lavalink'
    })
  }

  run(player) {
    if(player.lastMessage && !player.lastMessage.deleted) player.lastMessage.delete()
    player.textChannel.send('A playlist acabou')

    player._leaveTimeout = setTimeout(() => {
      player.destroy()
      player.textChannel.send('😴 Saindo do canal por inatividade')
    }, player.leaveTimeout)
  }
}