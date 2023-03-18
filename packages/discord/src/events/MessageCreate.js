import { BaseGatewayEvent, Message } from '@atlasbot/discord'

export default class MessageCreateEvent extends BaseGatewayEvent {
  handle (data) {
    if (data.d.type !== 0) return
    // DEFAULT
    // https://discord.com/developers/docs/resources/channel#message-object-message-types

    const message = new Message(this.client, data.d)
    this.client.emit('messageCreate', message)
  }
}
