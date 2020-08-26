const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'trackEnd',
      type: 'lavalink'
    })
  }

  run(player, track) {
    player.previousTrack = track || null
  }
}