import Listener from '../../lib/structures/Listener.js'
import LavalinkListenerLoader from '../../loaders/LavalinkListenerLoader.js'

export default class extends Listener {
  constructor() {
    super({
      name: 'ready',
      once: true
    })
  }

  run() {
    this.music.start(this.user.id)

    new LavalinkListenerLoader(this).load()
    console.log('[LOG] Online on client', this.user.username)
  }
}