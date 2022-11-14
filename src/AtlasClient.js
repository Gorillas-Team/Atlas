const { Client, Collection } = require('discord.js')
const { AtlasMusicManager, AtlasPlayer } = require('./lib/structures/music')
const Loaders = require('./loaders')

module.exports = class AtlasClient extends Client {
  constructor(options = {}) {
    super({
      ...options.clientOptions,
      intents: options.intents
    })
    this.token = options.token
    this.config = {
      owners: options.owners instanceof Array ? options.owners : [options.owners],
      prefixes: options.prefixes instanceof Array ? options.prefixes : [options.prefixes],
      nodes: options.nodes,
      environment: options.environment,
      clientOptions: options.clientOptions,
      logChannel: options.logChannel,
      leaveTimeout: options.leaveTimeout,
      color: options.color
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

  initLoaders() {
    for(const Loader of Object.values(Loaders)) {
      try {
        const loader = new Loader(this)
        if(loader.critical) loader.init()
      } catch(ex) {
        throw new Error(ex)
      }
    }

    return this
  }

  start() {
    this.initLoaders()
    this.login(this.token)
    return this
  }
}