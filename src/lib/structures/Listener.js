export default class Listener {
  constructor (options = {}) {
    this.name = options.name || null
    this.once = options.once || null
    this.type = options.type || 'discord'
  }

  listen (client) {
    try {
      const typeListen = this.once ? 'once' : 'on'

      this.type === 'discord' ? client[typeListen](this.name, this.run) : client.music[typeListen](this.name, this.run)

      return true
    } catch (ex) {
      console.error(ex)
      return false
    }
  }

  run () { }
}
