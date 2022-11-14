import Loader from '../lib/structures/Loader.js'
import FileUtils from '../lib/utils/FileUtils.js'

export default class LavalinkListenerLoader extends Loader {
  constructor (client) {
    super(client, 'listeners')
    this.critical = false
  }

  load () {
    try {
      this.init()
      this.log(this.failed ? this.success + ' carregaram com sucesso e ' + this.failed + ' falharam' : 'Todos carregados com sucesso')
      return true
    } catch (err) {
      this.logError(err.stack)
    }
    return false
  }

  init () {
    this.log('Carregando Lavalink Listeners')
    return FileUtils.requireDir({ dir: 'src/listeners/lavalink' }, async (error, Listener) => {
      if (error) {
        this.logError('    Stack: ' + error.stack)
        return this.failed++
      }

      const listener = new Listener()
      listener.listen(this.client)

      console.info('[LAVALINK LISTENER] [' + listener.name + '] carregado')
    })
  }
}
