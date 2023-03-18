import { PayloadOpcodes } from '../Constants.js'
import DispatcherManager from './DispatcherManager.js'

export default class EventManager {
  constructor (client) {
    this.client = client
    this.sequence = null

    this.heartbeatInterval = null
    this.interval = null

    this.loggedIn = false

    this.opHandlers = {
      [PayloadOpcodes.DISPATCH]: this.dispatch,
      [PayloadOpcodes.HEARTBEAT]: this.heartbeat,
      [PayloadOpcodes.RECONNECT]: this.reconnect,
      [PayloadOpcodes.INVALID_SESSION]: this.invalidSession,
      [PayloadOpcodes.HELLO]: this.hello,
      [PayloadOpcodes.HEARTBEAT_ACK]: this.heartbeatAck
    }

    this.dispatcherManager = new DispatcherManager(client)
  }

  handle (data) {
    this.client.emit('raw', data)

    if (data.s) this.sequence = data.s
    const handler = this.opHandlers[data.op]

    if (!handler) return

    handler.call(this, data)
  }

  dispatch (data) {
    this.dispatcherManager.handle(data)
  }

  heartbeat () {
    this.client.ws.send({
      op: 1,
      d: this.sequence
    })
  }

  reconnect () {
    this.client.emit('reconnect')
    this.reset()
  }

  invalidSession () {
    this.client.emit('invalidSession')
    this.reset()
  }

  hello (data) {
    this.heartbeatInterval = data.d.heartbeat_interval

    if (this.interval) clearInterval(this.interval)

    this.interval = setInterval(() => {
      this.client.ws.send({
        op: 1,
        d: this.sequence
      })
    }, this.heartbeatInterval)

    this.client.emit('hello', data.d)
    if (!this.loggedIn) this.login()
  }

  heartbeatAck () {
    this.client.emit('heartbeatAck')
  }

  login () {
    this.client.ws.send({
      op: 2,
      d: {
        token: this.client._token,
        intents: this.client.intents,

        properties: {
          $os: process.platform,
          $browser: 'AtlasBot',
          $device: 'AtlasBot'
        }
      }
    })

    this.loggedIn = true
  }

  reset () {
    clearInterval(this.interval)

    this.sequence = null
    this.loggedIn = false
    this.client.ws.reconnect()
  }
}
