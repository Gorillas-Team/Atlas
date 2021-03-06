const { Command } = require('../../lib/structures')
const { TimeUtils } = require('../../lib/utils')
const { MessageEmbed } = require('discord.js')

module.exports = class NowPlaying extends Command {
  constructor(client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'playing']
    this.category = 'music'
    this.conf = {
      needsPlayer: true,
      playingOnly: true
    }
  }

  run({ channel }) {
    const { title, author, uri, identifier, length } = this.player.queue[0]
    const time = this.player.state.position

    return channel.send(new MessageEmbed()
      .setAuthor(author)
      .setTitle('Tocando agora ' + title)
      .setURL(uri)
      .setDescription(`\`\`\`▶ [${TimeUtils.progress({ total: length, current: time, length: 24 })}] - [${ TimeUtils.msToTime(time) }]\`\`\``)
      .setThumbnail(`https://img.youtube.com/vi/${identifier}/mqdefault.jpg`)
      .setColor(this.client.config.color)
    )
  }
}
