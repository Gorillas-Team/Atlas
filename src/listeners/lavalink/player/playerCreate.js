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
    this.client.user.setActivity(this.players.size, { type: ActivityType.Listening })

    const guild = this.client.guilds.cache.get(player.guild)
    
    console.log('Player created at ' + guild.name)
  }
}
