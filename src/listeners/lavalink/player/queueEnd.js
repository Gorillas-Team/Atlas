const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'queueEnd',
      type: 'lavalink'
    })
  }

  run(player) {
    player.textChannel.send('A playlist acabou')
  }
}