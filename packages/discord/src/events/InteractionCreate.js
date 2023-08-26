import { BaseGatewayEvent, Interaction } from '@atlasbot/discord'

// https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
export default class InteractionCreate extends BaseGatewayEvent {
  handle (data) {
    const interaction = new Interaction(this.client, data.d)
    this.client.emit('interactionCreate', interaction)
  }
}
