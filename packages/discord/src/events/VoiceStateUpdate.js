import { BaseGatewayEvent, VoiceState } from '@atlasbot/discord'
import { Maybe } from '@atlasbot/utils'

// https://discord.com/developers/docs/topics/gateway-events#voice-state-update
// https://discord.com/developers/docs/resources/voice#voice-state-object
export default class VoiceStateUpdate extends BaseGatewayEvent {
  handle (data) {

    const oldVoiceState = this.client.voiceStates.get(data.d.channel_id)
    const newVoiceState = new VoiceState(this.client, data.d)

    newVoiceState.member.voiceState = Maybe.of(newVoiceState)
    // console.log(newVoiceState.member)
    this.client.voiceStates.set(data.d.channel_id, newVoiceState)
    this.client.emit('voiceStateUpdate', oldVoiceState, newVoiceState)
  }
}
