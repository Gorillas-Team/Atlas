import { Maybe } from '@atlasbot/utils'

export default class User {
  constructor (data) {
    this.id = data.id
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar
    this.bot = Maybe.maybe(data.bot).getOr(false)
    this.locale = Maybe.maybe(data.locale)
    this.verified = Maybe.maybe(data.verified)
    this.flags = Maybe.maybe(data.flags)
    this.premiumType = Maybe.maybe(data.premium_type)
    this.publicFlags = data.public_flags
  }
}
