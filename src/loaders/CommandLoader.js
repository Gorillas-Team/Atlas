import Loader from '../lib/structures/Loader.js'

export default class CommandLoader extends Loader {
  constructor (client) {
    super(client, 'commands', 'src/commands')
  }

  onLoad (Command) {
    const cmd = new Command(this.client)
    this.client.commands.set(cmd.name, cmd)

    this.log('[' + cmd.name + '] carregado')
  }
}
