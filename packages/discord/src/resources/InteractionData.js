import { Maybe } from '@atlasbot/utils'

// TODO: import from index @atlasbot/discord
import InteractionDataOptions from './InteractionDataOptions.js'

export default class InteractionData extends InteractionDataOptions {
  constructor (data) {
    super(data)

    this.id = data.id
    this.resolved = Maybe.of(data.resolved)
  }
}
