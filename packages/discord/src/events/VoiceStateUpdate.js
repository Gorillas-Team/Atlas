import { BaseGatewayEvent, VoiceState } from '@atlasbot/discord'

export default class VoiceStateUpdate extends BaseGatewayEvent {
  handle (data) {
    // https://discord.com/developers/docs/topics/gateway-events#voice-state-update
    // https://discord.com/developers/docs/resources/voice#voice-state-object

    const oldVoiceState = this.client.voiceStates.cache.get(data.d.id)
    const newVoiceState = new VoiceState(this.client, data.d)

    this.client.voiceStates.cache.set(data.d.id, newVoiceState)

    this.client.emit('voiceStateUpdate', oldVoiceState, newVoiceState)
  }
}
