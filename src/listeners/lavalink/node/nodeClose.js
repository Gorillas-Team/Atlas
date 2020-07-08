const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'nodeClose',
      type: 'lavalink'
    })
  }

  run(event, node) {
    console.error(`Connection to node ${node.tag || node.host} has been lost, reason: ${event}`)
  }
}