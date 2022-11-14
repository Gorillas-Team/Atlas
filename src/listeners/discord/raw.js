import Listener from '../../lib/structures/Listener.js'

export default class extends Listener {
  constructor() {
    super({
      name: 'raw'
    })
  }

  async run(packet) {
    // if (packet.t === 'MESSAGE_CREATE') {
    //   const message = packet.d
    //   console.log('content:', message.content)
    // }
    this.music.packetUpdate(packet)
  }
}