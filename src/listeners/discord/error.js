import Listener from '../../lib/structures/Listener.js'
import { inspect } from 'util'

export default class extends Listener {
  constructor() {
    super({
      name: 'error'
    })
  }

  async run(error) {
    console.error('[ERROR]', error)
  }
}