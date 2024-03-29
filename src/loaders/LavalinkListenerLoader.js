import Loader from '../lib/structures/Loader.js'

export default class LavalinkListenerLoader extends Loader {
  constructor (client) {
    super(client, 'lavalink', 'src/listeners/lavalink')
    this.critical = false
  }

  onLoad (Listener) {
    const listener = new Listener()
    listener.listen(this.client)

    this.log('[' + listener.name + '] carregado')
  }
}
