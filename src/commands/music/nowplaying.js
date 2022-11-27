import Command from '../../lib/structures/Command.js'
import TimeUtils from '../../lib/utils/TimeUtils.js'
import { EmbedBuilder } from 'discord.js'

export default class NowPlaying extends Command {
  constructor (client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'playing']
    this.category = 'music'
    this.conf = {
      needsPlayer: true,
      playingOnly: true
    }
  }

  run () {
    const { title, author, uri, identifier, duration } = this.player.queue[0]
    const time = this.player.state.position

    const embed = new EmbedBuilder()
      .setTitle(`Tocando agora ${title} - ${author}`)
      .setURL(uri)
      .setDescription(`\`\`\`▶ [${TimeUtils.progress(25, duration, time)}] - [${TimeUtils.msToHours(time)}]\`\`\``)
      .setThumbnail(`https://img.youtube.com/vi/${identifier}/mqdefault.jpg`)
      .setColor(this.client.config.color)

    return { embeds: [embed.toJSON()] }
  }
}
