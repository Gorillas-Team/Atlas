import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'playerCreate',
      type: 'lavalink'
    })
  }

  run (player) {
    player.manager.updateStats()

    const guild = this.client.guilds.cache.get(player.guild)
    console.log('[LAVALINK] Player created at:', guild.id)
  }
}
