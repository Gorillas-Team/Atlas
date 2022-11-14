import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
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