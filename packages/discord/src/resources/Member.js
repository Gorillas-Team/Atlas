// import User from './User.js'
import { Maybe, SugarMap } from '@atlasbot/utils'

// TODO: import from index @atlasbot/discord
import User from './User.js'

const mapRoles = (guild) => (roleId) => [roleId, guild.roles.get(roleId)]

export default class Member {
  constructor (guild, data) {
    this.user = Maybe.of(data.user).map((user) => new User(user))
    this.nick = Maybe.of(data.nick)
    this.guild = guild
    this.voiceState = Maybe.of(data.voice_state)

    this.roles = new SugarMap(
      data.roles.map(mapRoles(guild))
    )

    this.joinedAt = data.joined_at
  }
}
