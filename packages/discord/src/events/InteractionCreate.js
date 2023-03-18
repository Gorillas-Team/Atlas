import { BaseGatewayEvent, Interaction } from '@atlasbot/discord'

export default class InteractionCreate extends BaseGatewayEvent {
  handle (data) {
    const interaction = new Interaction(this.client, data.d)
    // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
    this.client.emit('interactionCreate', interaction)
  }
}
