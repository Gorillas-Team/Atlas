const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'trackStart',
      type: 'lavalink'
    })
  }

  run(player, track) {
    if(player.lastMessage && !player.lastMessage.deleted) player.lastMessage.delete()
    player.textChannel.send(`Tocando agora \`${track.info.title}\``)
      .then(m => player.lastMessage = m)

    if(player._leaveTimeout){
      clearTimeout(player._leaveTimeout)
      delete player._leaveTimeout
    }
  }
}