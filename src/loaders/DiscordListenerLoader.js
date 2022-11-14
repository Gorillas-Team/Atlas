import Loader from '../lib/structures/Loader.js'
import FileUtils from '../lib/utils/FileUtils.js'

export default class DiscordListenerLoader extends Loader {
  constructor (client) {
    super(client, 'listeners')
    this.critical = true
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
    this.log('Carregando Discord Listeners')
    return FileUtils.requireDir({ dir: 'src/listeners/discord' }, async (error, Listener) => {
      if (error) {
        this.logError('    Stack: ' + error.stack)
        return this.failed++
      }

      const listener = new Listener()
      listener.listen(this.client)

      console.info('[DISCORD LISTENER] [' + listener.name + '] carregado')
    })
  }
}
