import EventEmitter from 'node:events'
import { notDeepStrictEqual, ok } from 'node:assert'
import { RequestUtils, SugarMap } from '@atlasbot/utils'
import { Message } from '@atlasbot/discord'
import * as Endpoints from './Endpoints.js'

import DiscordGateway from './gateway/DiscordGateway.js'

const DEFAULT_OPTIONS = {
  intents: 0,
  shards: 1
}

export default class Client extends EventEmitter {
  constructor (token, options) {
    super()

    Object.assign(this, DEFAULT_OPTIONS, options)
    Object.defineProperty(this, '_token', {
      configurable: false,
      writable: false,
      enumerable: false,
      value: token
    })

    this.v = ''
    this.user = {}
    this.guilds = {}
    this.channels = new SugarMap()
    this.application = {}
    this.sessionStartLimit = {}

    this.request = new RequestUtils('https://discord.com/api/v10/', {
      authorization: `Bot ${token}`
    })

    this.ws = new DiscordGateway(this)
  }

  async login () {
    await this.ws.login()
    return this
  }

  async sendMessage (channelId, messagePayload) {
    ok(channelId, 'Missing channel id')
    ok(messagePayload, 'Missing messagePayload')

    const { guild } = this.channels.get(channelId)
    const payload = await this.request.post(Endpoints.ChannelMessage(channelId), messagePayload)
      .then((res) => res.body.json())

    return new Message(this, Object.assign(payload, { guild_id: guild.id }))
  }

  async editMessage (message, messagePayload) {
    ok(messagePayload, 'Missing messagePayload')
    notDeepStrictEqual(message, Message)

    const { guild, id: channelId } = message.channel
    const payload = await this.request.patch(Endpoints.ChannelMessageEdit(channelId), messagePayload)
      .then((res) => res.body.json())

    return new Message(this, Object.assign(payload, { guild_id: guild.id }))
  }

  async deleteMessage (message) {
    notDeepStrictEqual(message, Message)

    const { id: channelId } = message.channel
    return await this.request.delete(Endpoints.ChannelMessageEdit(channelId))
      .then((res) => (res.statusCode) === 204)
  }

  async sendWebhook (webhookId, token, webhookPayload) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')
    ok(webhookPayload, 'Missing webhookPayload')

    const payload = await this.request.post(Endpoints.Webhook(webhookId, token), webhookPayload)
      .then((res) => res.body.json())

    return new Message(this, payload)
  }

  async editWebhook (webhookId, token, messageId, webhookPayload) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')
    ok(webhookPayload, 'Missing webhookPayload')

    const url = Endpoints.WebhookMessage(webhookId, token, messageId)

    const payload = await this.request.patch(url, webhookPayload)
      .then((res) => res.body.json())

    return new Message(this, payload)
  }

  async deleteWebhook (webhookId, token, messageId) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')

    const url = Endpoints.WebhookMessage(webhookId, token, messageId)

    return await this.request.delete(url)
      .then((res) => (res.statusCode) === 204)
  }

  async interactionReply (interaction, messagePayload) {
    ok(interaction, 'Missing interaction')
    ok(messagePayload, 'Missing messagePayload')

    const payload = await this.request.post(Endpoints.Interaction(interaction.id, interaction.token), messagePayload)
    interaction.acknowledged = true

    return (payload.statusCode === 204)
  }

  async interactionEdit (interaction, messageId, messagePayload) {
    ok(interaction, 'Missing interaction')
    ok(messagePayload, 'Missing messagePayload')

    if (!interaction.acknowledged) return

    return this.editWebhook(this.user.id, interaction.token, messageId, messagePayload)
  }

  async interactionDelete (interaction, messageId) {
    ok(interaction, 'Missing interaction')

    if (!interaction.acknowledged) return

    return this.deleteWebhook(this.user.id, interaction.token, messageId)
  }
}
