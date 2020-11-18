const { Listener } = require('../../lib/structures')
const { inspect } = require('util')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'raw'
    })
  }

  async run(packet) {
    this.music.packetUpdate(packet)
  }
}