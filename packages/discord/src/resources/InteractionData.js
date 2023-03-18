import { Maybe } from '@atlasbot/utils'
import InteractionDataOptions from './InteractionDataOptions.js'

export default class InteractionData extends InteractionDataOptions {
  constructor (data) {
    super(data)

    this.id = data.id
    this.resolved = Maybe.maybe(data.resolved)
  }
}
