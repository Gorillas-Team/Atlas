import { Maybe, SugarMap } from '@atlasbot/utils'

import User from './User.js'

export default class Member {
  constructor (guild, data) {
    this.user = Maybe.of(data.user).map((user) => new User(user))
    this.nick = Maybe.of(data.nick)
    this.guild = guild

    this.roles = new SugarMap(
      data.roles.map((roleId) => [roleId, guild.roles.get(roleId)])
    )

    this.joinedAt = data.joined_at
  }

  get voiceState () {
    return this.guild.voiceStates.get(this.user.id)
  }
}
