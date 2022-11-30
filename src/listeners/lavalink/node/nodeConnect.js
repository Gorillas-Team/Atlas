import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'nodeConnect',
      type: 'lavalink'
    })
  }

  run (node) {
    console.log(`[LOG] ${node.tag || node.host} node connected`)
  }
}
