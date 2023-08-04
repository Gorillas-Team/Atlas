import { Maybe } from '@atlasbot/utils'

// TODO: import from index @atlasbot/discord
import Member from './Member.js'
import User from './User.js'

export default class Message {
  constructor (client, data) {
    this.id = data.id

    this.guild = client.guilds.cache.get(data.guild_id)
    this.channel = Maybe.of(this.guild).map((g) => g.channels.get(data.channel_id)).getOr(null)
    this.type = data.type

    this.member = Maybe.of(data.member)
      .map((member) => new Member(this.guild, member))
      .getOr()

    this.content = data.content
    this.author = Maybe.of(data.author).map((user) => new User(user)).getOr(null)
    this.createdAt = data.timestamp
  }
}
