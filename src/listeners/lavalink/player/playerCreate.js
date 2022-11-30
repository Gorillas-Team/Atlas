import { ActivityType } from 'discord.js'
import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'playerCreate',
      type: 'lavalink'
    })
  }

  run (player) {
    const size = this.client.music.players.size
    const activity = `${size} player${size === 1 ? '' : 's'}`

    this.client.user.setActivity(activity, { type: ActivityType.Listening })

    const guild = this.client.guilds.cache.get(player.guild)
    console.log('[LAVALINK] Player created at:', guild.id)
  }
}
