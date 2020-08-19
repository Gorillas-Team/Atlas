const { Listener } = require('../../lib/structures')
const { LavalinkListenerLoader } = require('../../loaders')
const AtlasMusicManager = require('../../lib/structures/music/AtlasMusicManager')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'ready',
      once: true
    })
  }

  run() {
    this.music = new AtlasMusicManager(this, this.config.nodes)

    new LavalinkListenerLoader(this).load()
    console.log('Online on client', this.user.username)
  }
}