const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'nodeReconnect',
      type: 'lavalink'
    })
  }

  run(node) {
    console.error(`Trying to reconnect to the node: ${node.tag || node.host}`)
  }
}