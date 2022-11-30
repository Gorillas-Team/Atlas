import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'nodeReconnect',
      type: 'lavalink'
    })
  }

  run (node) {
    console.error(`Trying to reconnect to the node: ${node.tag || node.host}`)
  }
}
