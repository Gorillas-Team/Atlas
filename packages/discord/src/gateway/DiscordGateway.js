import WebSocket from 'ws'

// TODO: import from index @atlasbot/discord
import EventManager from './EventManager.js'

export default class DiscordGateway {
  constructor (client) {
    this.connection = null

    this.url = ''
    this.resumeURL = ''
    this.recommendedShards = 0
    this.intents = client.intents

    this.client = client
    this.eventManager = new EventManager(client)
  }

  async fetchEndpoint () {
    const res = await this.client.request.get('gateway/bot')
    const json = await res.body.json()

    this.url = json.url
    this.recommendedShards = json.shards
    this.client.sessionStartLimit = json.session_start_limit
  }

  async connect () {
    await this.fetchEndpoint()

    if (!this.url) throw new Error('No gateway URL was provided')

    this.connection = new WebSocket(this.url)

    this.connection.on('message', (data) => {
      const packet = JSON.parse(data.toString())
      this.eventManager.handle(packet)
    })

    this.connection.on('close', (code, reason) => {
      this.client.emit('close', code, reason)
    })

    this.connection.on('error', (error) => {
      this.client.emit('error', error)
    })
  }

  async login () {
    await this.connect()
  }

  send (data) {
    this.connection.send(JSON.stringify(data))
  }

  close (code, reason) {
    this.connection.close(code, reason)
  }

  destroy () {
    this.connection.terminate()
  }

  reconnect () {
    this.destroy()
    this.connect()
  }
}
