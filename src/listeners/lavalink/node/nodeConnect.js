const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'nodeConnect',
      type: 'lavalink'
    })
  }

  run(node) {
    console.log(`Node: ${node.tag || node.host} connected`)
  }
}