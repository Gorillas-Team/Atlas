import { Maybe } from '@atlasbot/utils'

const createInteractionDataOptions = (options) => options.map(InteractionDataOptions.from)

export default class InteractionDataOptions {
  static from (data) {
    return new InteractionDataOptions(data)
  }

  constructor (data) {
    this.name = data.name
    this.type = data.type
    this.value = Maybe.maybe(data.value)

    this.options = Maybe.maybe(data.options)
      .map(createInteractionDataOptions)
      .getOr([])
  }
}
