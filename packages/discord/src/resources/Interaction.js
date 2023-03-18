import { Maybe } from '@atlasbot/utils'

import Member from './Member.js'
import Message from './Message.js'
import InteractionData from './InteractionData.js'

export default class Interaction {
  constructor (client, data) {
    this.id = data.id

    this.applicationId = data.application_id
    this.type = data.type

    this.acknowledged = false
    this.data = new InteractionData(data.data)
    this.guild = client.guilds.cache.get(data.guild_id)
    this.channel = this.guild.channels.get(data.channel_id)

    this.member = Maybe.maybe(data.member).map((member) => new Member(this.guild, member))

    this.token = data.token
    this.version = data.version

    this.message = Maybe.maybe(data.message).map((message) => new Message(this.channel, message))
    this.locale = data.locale
  }
}
