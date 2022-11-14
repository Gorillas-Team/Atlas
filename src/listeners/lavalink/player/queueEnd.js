import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor() {
    super({
      name: 'queueEnd',
      type: 'lavalink'
    })
  }

  run(player) {
    player.execTimeout()
  }
}