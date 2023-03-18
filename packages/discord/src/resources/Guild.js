import { SugarMap, Maybe } from '@atlasbot/utils'
import { Role, Member, Channel, VoiceState } from '@atlasbot/discord'

export default class Guild {
  constructor (data) {
    this.id = data.id
    this.name = data.name
    this.description = Maybe.maybe(data.description)
    this.icon = data.icon
    this.owner = Maybe.maybe(data.owner)
    this.permissions = Maybe.maybe(data.permissions)
    this.joinedAt = data.joined_at
    this.unavailable = data.unavailable
    this.memberCount = data.member_count

    this.roles = new SugarMap(
      data.roles.map((role) => [role.id, new Role(role)])
    )

    this.members = new SugarMap(
      data.members.map((member) => [member.user.id, new Member(this, member)])
    )

    this.channels = new SugarMap(
      data.channels.map((chan) => [chan.id, new Channel(this, chan)])
    )

    this.voiceStates = new SugarMap(
      data.voice_states.map((state) => [state.id, new VoiceState(this, state)])
    )
  }
}
