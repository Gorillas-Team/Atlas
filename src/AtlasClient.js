import { Client, Collection } from 'discord.js'
import AtlasMusicManager from './lib/structures/music/AtlasMusicManager.js'
import AtlasPlayer from './lib/structures/music/AtlasPlayer.js'
import Loaders from './loaders/Loaders.js'

export default class AtlasClient extends Client {
  constructor (options = {}) {
    super({
      ...options.clientOptions,
      intents: options.intents
    })

    this.token = options.token

    this.config = {
      ...options
    }

    this.commands = new Collection()

    this.music = new AtlasMusicManager(this, this.config.nodes, {
      Player: AtlasPlayer,
      sendWS: (data) => {
        const guild = this.guilds.cache.get(data.d.guild_id)
        if (!guild) return

        return guild.shard.send(data)
      }
    })
  }

  initLoaders () {
    for (const Loader of Loaders) {
      try {
        const loader = new Loader(this)
        if (loader.critical) loader.init()
      } catch (ex) {
        throw new Error(ex)
      }
    }

    return this
  }

  start () {
    this.initLoaders()
    this.login(this.token)
    return this
  }
}
