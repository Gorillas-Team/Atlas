import { Maybe } from '@atlasbot/utils'

export default class User {
  constructor (data) {
    this.id = data.id
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar
    this.bot = Maybe.of(data.bot).getOr(false)
    this.locale = Maybe.of(data.locale)
    this.verified = Maybe.of(data.verified)
    this.flags = Maybe.of(data.flags)
    this.premiumType = Maybe.of(data.premium_type)
    this.publicFlags = data.public_flags
  }
}
