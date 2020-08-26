const { Listener } = require('../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'messageUpdate'
    })
  }

  async run(oldM, newM) {
    if (oldM.content === newM.content) return
    this.emit('message', newM)
  }
}