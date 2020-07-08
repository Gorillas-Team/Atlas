const Command = require('../../lib/structures/Command')

module.exports = class Pllay extends Command {
  constructor(client) {
    super(client)
    this.name = 'play'
    this.aliases = ['p']
    this.category = 'music'
  }

  async run({ channel, member, guild, args }) {
    const voiceChannel = member.voice.channel

    if(!voiceChannel) return channel.send('Você não esta em nenhum canal de voz')

    const player = this.client.music.join({
      guild,
      voiceChannel,
      textChannel: channel
    })

    const { tracks } = await this.client.music.fetchTracks(args.join(' '))

    const track = tracks[0]
    track.requester = member

    if(player.queue.length !== 0) channel.send(`A musica \`${track.info.title}\` foi adiconado a playlist por **${member.user.username}**`)
      .then(m => m.delete({ timeout: 10000 }))

    player.queue.add(track)
    if(!player.playing) return player.play()
  }
}