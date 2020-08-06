const Command = require('../../lib/structures/Command')

module.exports = class Play extends Command {
  constructor(client) {
    super(client)
    this.name = 'play'
    this.aliases = ['p']
    this.category = 'music'
  }

  async run({ channel, member, guild, args }) {
    const voiceChannel = member.voice.channel

    if(!voiceChannel) return channel.send('Você não esta em nenhum canal de voz')
    if(!args[0]) return channel.send('Você precisa me dizer uma musica ou uma URL')

    const player = this.client.music.join({
      guild,
      voiceChannel,
      textChannel: channel
    })

    const query = args.join(' ')

    const msg = await channel.send(`Procurando pelo video \`${query}\``)

    const { tracks } = await this.client.music.fetchTracks(query)
    if(player.textChannel !== channel) player.textChannel = channel

    const track = tracks[0]
    track.requester = member

    await msg.edit(`A musica \`${track.info.title}\` foi adicionado a playlist por **${member.user.username}**`)
      .then(m => m.delete({ timeout: 10000 }))

    player.queue.add(track)
    player.leaveTimeout = this.client.config.leaveTimeout || 180000

    if(!player.playing) return player.play()
  }
}