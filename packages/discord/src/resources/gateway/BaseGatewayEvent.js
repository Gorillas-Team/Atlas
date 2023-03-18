export default class BaseGatewayEvent {
  constructor (client) {
    this.client = client
  }

  handle (data) {
    throw new Error('handle method not implemented')
  }
}
