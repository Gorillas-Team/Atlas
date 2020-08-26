const { Listener } = require('../../lib/structures')
const { LavalinkListenerLoader } = require('../../loaders')
const { AtlasMusicManager, AtlasPlayer } = require('../../lib/structures/music')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'ready',
      once: true
    })
  }

  run() {
    this.music = new AtlasMusicManager(this, this.config.nodes, {
      Player: AtlasPlayer
    })

    new LavalinkListenerLoader(this).load()
    console.log('Online on client', this.user.username)
  }
}