module.exports = class Loader {
  constructor(client, name) {
    this.client = client
    this.critical = true
    this.success = 0
    this.failed = 0
    this.name = name || null
  }

  load() {
    return true
  }

  log(message) {
    return console.log(`${this.name ? '[' + this.name.toUpperCase() + '] ' : ''}${message}`)
  }

  logError(message) {
    return console.error(`${this.name ? '[' + this.name.toUpperCase() + '] ' : ''}${message}`)
  }
}
