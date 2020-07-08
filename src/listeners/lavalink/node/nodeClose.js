const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'nodeClose',
      type: 'lavalink'
    })
  }

  run(node) {
    console.error(`Connection to node ${node.tag || node.host} has been lost, trying to reconnect`)
  }
}