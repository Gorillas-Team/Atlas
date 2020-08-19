const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'nodeError',
      type: 'lavalink'
    })
  }

  run(node, error) {
    console.error(`An unexpected error happened on ${node.tag || node.host}, ${error.stack}`)
  }
}