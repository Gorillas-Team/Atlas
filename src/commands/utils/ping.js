import Command from '../../lib/structures/Command.js'

export default class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.aliases = ['latencia']
    this.category = 'utils'
    this.description = 'Shows the bot\'s ping'
  }

  run () {
    return `Pong! 🏓 \`${this.client.ws.ping}ms\``
  }
}
