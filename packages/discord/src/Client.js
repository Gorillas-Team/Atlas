import EventEmitter from 'node:events'
import { notDeepStrictEqual, ok } from 'node:assert'

import { RequestUtils, SugarMap } from '@atlasbot/utils'
import { Message, Endpoints, DiscordGateway } from '@atlasbot/discord'

/**
 * The default client options.
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  intents: 0,
  shards: 1
}

/**
 * Represents a Discord bot client.
 * @extends EventEmitter
 */
export default class Client extends EventEmitter {
  /**
   * Creates a new instance of the Client class.
   * @param {string} token - The Discord bot token.
   * @param {Object} [options] - The optional client options.
   * @param {number} [options.intents=0] - The Discord client intents.
   * @param {number} [options.shards=1] - The number of Discord client shards.
   */
  constructor (token, options) {
    super()

    Object.assign(this, DEFAULT_OPTIONS, options)

    /**
     * The Discord bot token.
     * @type {string}
     * @private
     * @readonly
     */
    Object.defineProperty(this, '_token', {
      configurable: false,
      writable: false,
      enumerable: false,
      value: token
    })

    /**
     * The Discord API version.
     * @type {string}
     * @default ''
     */
    this.v = ''

    /**
     * The bot user.
     * @type {Object}
     * @default {}
     */
    this.user = {}

    /**
     * The bot's guilds.
     * @type {Object}
     * @default {}
     */
    this.guilds = {}

    /**
     * The bot's channels.
     * @type {SugarMap}
     * @default new SugarMap()
     */
    this.channels = new SugarMap()

    /**
     * The bot's application.
     * @type {Object}
     * @default {}
     */
    this.application = {}

    /**
     * The session start limit information.
     * @type {Object}
     * @default {}
     */
    this.sessionStartLimit = {}

    /**
     * The utility object for making API requests.
     * @type {RequestUtils}
     */
    this.request = new RequestUtils('https://discord.com/api/v10/', {
      authorization: `Bot ${token}`
    })

    /**
     * The Discord gateway object.
     * @type {DiscordGateway}
     */
    this.ws = new DiscordGateway(this)
  }

  /**
   * Logs the client into Discord.
   * @returns {Promise<Client>} A Promise that resolves to the logged-in client instance.
   */
  async login () {
    await this.ws.login()
    return this
  }

  /**
   * Sends a message to a Discord channel.
   * @param {string} channelId - The ID of the target channel.
   * @param {Object} messagePayload - The message payload to send.
   * @returns {Promise<Message>} A Promise that resolves to the sent message.
   */
  async sendMessage (channelId, messagePayload) {
    ok(channelId, 'Missing channel id')
    ok(messagePayload, 'Missing messagePayload')

    const { guild } = this.channels.get(channelId)
    const payload = await this.request.post(Endpoints.ChannelMessage(channelId), messagePayload)
      .then((res) => res.body.json())

    return new Message(this, Object.assign(payload, { guild_id: guild.id }))
  }

  /**
   * Edits a Discord message.
   * @param {Message} message - The message to edit.
   * @param {Object} messagePayload - The message payload to edit.
   * @returns {Promise<Message>} A Promise that resolves to the edited message.
   */
  async editMessage (message, messagePayload) {
    ok(messagePayload, 'Missing messagePayload')
    notDeepStrictEqual(message, Message)

    const { guild, id: channelId } = message.channel
    const payload = await this.request.patch(Endpoints.ChannelMessageEdit(channelId), messagePayload)
      .then((res) => res.body.json())

    return new Message(this, Object.assign(payload, { guild_id: guild.id }))
  }

  /**
   * Deletes a Discord message.
   * @param {Message} message - The message to delete.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the message was deleted.
   */
  async deleteMessage (message) {
    notDeepStrictEqual(message, Message)

    const { id: channelId } = message.channel
    return await this.request.delete(Endpoints.ChannelMessageEdit(channelId))
      .then((res) => (res.statusCode) === 204)
  }

  /**
   * Sends a webhook to a Discord channel.
   * @param {string} channelId - The ID of the target channel.
   * @param {Object} messagePayload - The message payload to send.
   * @returns {Promise<Message>} A Promise that resolves to the sent message.
   */
  async sendWebhook (webhookId, token, webhookPayload) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')
    ok(webhookPayload, 'Missing webhookPayload')

    const payload = await this.request.post(Endpoints.Webhook(webhookId, token), webhookPayload)
      .then((res) => res.body.json())
    return new Message(this, payload)
  }

  /**
   * Edits a Discord webhook.
   * @param {Message} message - The message to edit.
   * @param {Object} messagePayload - The message payload to edit.
   * @returns {Promise<Message>} A Promise that resolves to the edited message.
   */
  async editWebhook (webhookId, token, messageId, webhookPayload) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')
    ok(webhookPayload, 'Missing webhookPayload')

    const url = Endpoints.WebhookMessage(webhookId, token, messageId)

    const payload = await this.request.patch(url, webhookPayload)
      .then((res) => res.body.json())
    return new Message(this, payload)
  }

  /**
   * Deletes a Discord webhook.
   * @param {Message} message - The message to delete.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the message was deleted.
   */
  async deleteWebhook (webhookId, token, messageId) {
    ok(webhookId, 'Missing webhookId')
    ok(token, 'Missing token')

    const url = Endpoints.WebhookMessage(webhookId, token, messageId)
    return await this.request.delete(url)
      .then((res) => (res.statusCode) === 204)
  }

  /**
   * Sends a interaction response to a Discord channel.
   * @param {Interaction} interaction - The interaction to respond to.
   * @param {Object} messagePayload - The message payload to send.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the interaction was acknowledged.
   */
  async interactionReply (interaction, messagePayload) {
    ok(interaction, 'Missing interaction')
    ok(messagePayload, 'Missing messagePayload')

    const payload = await this.request.post(Endpoints.Interaction(interaction.id, interaction.token), messagePayload)
    interaction.acknowledged = true
    return (payload.statusCode === 204)
  }

  /**
   * Edits a Discord interaction response.
   * @param {Interaction} interaction - The interaction to edit.
   * @param {Object} messagePayload - The message payload to edit.
   * @returns {Promise<Message>} A Promise that resolves to the edited message.
   */
  async interactionEdit (interaction, messageId, messagePayload) {
    ok(interaction, 'Missing interaction')
    ok(messagePayload, 'Missing messagePayload')

    if (!interaction.acknowledged) return
    return this.editWebhook(this.user.id, interaction.token, messageId, messagePayload)
  }

  /**
   * Deletes a Discord interaction response.
   * @param {Interaction} interaction - The interaction to delete.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the interaction was deleted.
   */
  async interactionDelete (interaction, messageId) {
    ok(interaction, 'Missing interaction')

    if (!interaction.acknowledged) return
    return this.deleteWebhook(this.user.id, interaction.token, messageId)
  }
}
