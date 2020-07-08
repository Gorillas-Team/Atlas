const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'trackStart',
      type: 'lavalink'
    })
  }

  run(player, track) {
    player.textChannel.send(`Tocando agora \`${track.info.title}\``)
  }
}