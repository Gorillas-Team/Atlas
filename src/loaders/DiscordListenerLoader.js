import Loader from '../lib/structures/Loader.js'

export default class DiscordListenerLoader extends Loader {
  constructor (client) {
    super(client, 'discord', 'src/listeners/discord')
    this.critical = true
  }

  onLoad (Listener) {
    const listener = new Listener()
    listener.listen(this.client)

    this.log('[' + listener.name + '] carregado')
  }
}
