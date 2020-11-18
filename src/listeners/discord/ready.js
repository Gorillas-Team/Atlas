const { Listener } = require('../../lib/structures')
const { LavalinkListenerLoader } = require('../../loaders')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'ready',
      once: true
    })
  }

  run() {
    this.music.start(this.user.id)

    new LavalinkListenerLoader(this).load()
    console.log('Online on client', this.user.username)
  }
}