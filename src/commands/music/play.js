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

    tracks[0].requester = member
    player.queue.add(tracks[0])

    if(!player.playing) return player.play()
  }
}