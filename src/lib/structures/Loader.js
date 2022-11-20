import { loadDirectory } from '../utils/FileUtils.js'

export default class Loader {
  constructor (client, name, path) {
    this.client = client
    this.name = name || null
    this.path = path
    this.critical = true
  }

  init () {
    this.log('Carregando')

    this.load()
  }

  async load () {
    const mods = await loadDirectory(this.path)

    for (const mod of mods) {
      this.onLoad(mod)
    }
  }

  onLoad () {
    throw new Error(`${this.name}.onLoad() not implemented`)
  }

  log (...args) {
    return console.log(`[${this.name?.toUpperCase()}]`, ...args)
  }
}
