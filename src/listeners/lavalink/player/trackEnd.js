import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'trackEnd',
      type: 'lavalink'
    })
  }

  run (player, track) {
    player.previousTrack = track || null
    if (player.queue.length < 1) player.execTimeout()
  }
}
