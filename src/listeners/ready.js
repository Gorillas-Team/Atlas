const { Listener } = require('../lib/structures')

module.exports = class extends Listener {
  constructor(){
    super({
      name: 'ready',
      once: true
    })
  }

  run() {
    console.log('Online on client', this.user.username)
  }
}