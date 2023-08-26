import { BaseGatewayEvent, Message } from '@atlasbot/discord'

// https://discord.com/developers/docs/resources/channel#message-object-message-types
export default class MessageCreateEvent extends BaseGatewayEvent {
  handle (data) {
    if (data.d.type !== 0) return

    const message = new Message(this.client, data.d)
    this.client.emit('messageCreate', message)
  }
}
