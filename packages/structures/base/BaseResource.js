export default class BaseResource {
  constructor (client) {
    this.client = client
  }

  toString () {
    return this.constructor.name
  }
}
