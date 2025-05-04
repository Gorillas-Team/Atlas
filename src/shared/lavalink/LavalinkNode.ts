import { WebSocket } from 'ws'
import { LavalinkClient } from './LavalinkClient'
import { Logger } from 'pino'
import { LavalinkPacket, ReadyPacket } from './LavalinkPackets'
import { LavalinkApi } from './api/LavalinkApi'
import { LavalinkPlayer, LavalinkSpawnOptions } from './LavalinkPlayer'

export type LavalinkNodeOptions = {
  name: string
  host: string
  port: number
  password: string
  maxReconnectAttempts?: number
}

const WEBSOCKET_ENDPOINT = 'v4/websocket'
const CLIENT_NAME = 'Atlas'
const CLIENT_VERSION = '1.0.0'
const RETRY_DELAY = 5000

export class LavalinkNode {
  public logger: Logger
  public lavalink: LavalinkClient
  public name: string
  public host: string
  public port: number
  public clientId: string
  public password: string
  public resumed: boolean = false
  public sessionId: string | null = null
  public ws: WebSocket | null = null
  public maxReconnectAttempts: number = 5
  public reconnectAttempts: number = 0
  public reconnectTimeout: NodeJS.Timeout | null = null
  public api: LavalinkApi | null = null

  constructor(lavalink: LavalinkClient, options: LavalinkNodeOptions) {
    const { name, host, port, password } = options
    this.lavalink = lavalink
    this.name = name
    this.host = host
    this.port = port
    this.password = password
    this.clientId = lavalink.clientId
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5
    this.logger = lavalink.logger.child({
      name: `${this.constructor.name}/${name}`
    })
  }

  public connect() {
    const { host, port, password, sessionId, clientId, resumed } = this

    const baseUrl = `//${host}:${port}/${WEBSOCKET_ENDPOINT}`
    const headers = {
      Authorization: password,
      'Client-Name': `${CLIENT_NAME}/${CLIENT_VERSION}`,
      'User-Id': clientId,
      'Session-Id': sessionId ?? '',
      'Session-Resumed': String(resumed)
    }

    this.ws = new WebSocket(`ws:${baseUrl}`, { headers })
    this.api = new LavalinkApi(`http:${baseUrl}`, password)

    this.ws.on('open', () => this.onOpen())
    this.ws.on('message', (message: string) => this.onMessage(message))
    this.ws.on('error', (error: Error) => this.onError(error))
    this.ws.on('close', () => this.onClose())

    this.logger.info(`Connecting to Lavalink node ${this.name} at ws:${baseUrl}`)
  }

  private onMessage(message: string) {
    const packet: LavalinkPacket = JSON.parse(message)

    if (packet.op == 'ready') this.handleReadyPacket(packet)
  }

  private handleReadyPacket(packet: ReadyPacket) {
    this.resumed = packet.resumed
    this.sessionId = packet.sessionId
  }

  private onOpen() {
    this.logger.info('Connected to Lavalink node')
    this.resumed = false
    this.clearReconnectTimeout()
    this.reconnectAttempts = 0
  }

  private onError(error: Error) {
    this.logger.error(`WebSocket error on Lavalink node: ${error.message}`)
  }

  private onClose() {
    this.logger.warn('WebSocket connection closed to Lavalink node')
    this.clearReconnectTimeout()

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      this.logger.info(
        `Reconnecting attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} delayed by ${RETRY_DELAY}ms`
      )
      this.reconnectTimeout = setTimeout(() => {
        this.connect()
      }, RETRY_DELAY)
    } else {
      this.logger.error('Max reconnect attempts reached. Not reconnecting.')
    }

    this.sessionId = null
    this.ws = null
  }

  private clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  public reconnect() {
    if (this.ws) {
      this.ws.close()
    }

    this.connect()
  }
}
