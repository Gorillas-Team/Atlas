import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
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