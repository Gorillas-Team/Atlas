import { RequestUtils, SugarMap } from '@atlasbot/utils'
import * as Endpoints from './Endpoints.js'
import Player from './Player.js'
import crypto from 'crypto'
import WebSocket from 'ws'

class Node {
  constructor (manager, options) {
    this.manager = manager
    this.options = options

    this.tag = options.tag || crypto.randomBytes(6).toString('hex')

    this.stats = {
      players: 0,
      playingPlayers: 0,
      uptime: 0,
      memory: {
        reservable: 0,
        used: 0,
        free: 0,
        allocated: 0
      },
      cpu: {
        cores: 0,
        systemLoad: 0,
        lavalinkLoad: 0
      }
    }

    this.connected = false
    this.ready = false
    this.reconnectTimeout = null

    this.ws = null
    this.sessionId = null

    this.requester = new RequestUtils(Endpoints.RestApiUrl(options.host, options.port), {
      Authorization: options.password
    })

    this.players = new SugarMap()

    this.connect()
  }

  async connect () {
    this.ws = new WebSocket(Endpoints.WebSocketConnection(this.options.host, this.options.port), {
      headers: {
        Authorization: this.options.password,
        'User-Id': this.manager.client.user.id,
        'Client-Name': 'AtlasLavalink/1.0.0'
      }
    })

    this.ws.on('open', () => {
      this.connected = true
    })

    this.ws.on('message', (data) => {
      const packet = JSON.parse(data.toString())

      if (packet.op === 'ready') {
        this.sessionId = packet.sessionId
      }
    })
  }

  join (guildId, channelId) {
    this.manager.client.ws.send({
      op: 4,
      d: {
        guild_id: guildId,
        channel_id: channelId,
        self_deaf: false,
        self_mute: false
      }
    })

    const player = new Player(this.manager, this, { guildId, channelId })
    this.players.set(guildId, player)

    return player
  }
}

export default Node
