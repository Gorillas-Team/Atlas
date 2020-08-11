const Command = require('../../lib/structures/music/MusicCommand')

module.exports = class Play extends Command {
  constructor(client) {
    super(client)
    this.name = 'play'
    this.aliases = ['p']
    this.category = 'music'
    this.checkVoiceMember = true
    this.checkSameChannel = true
  }

  async musicRun({ channel, member, guild, args }) {
    if(!args[0]) return channel.send('Você precisa me dizer uma musica ou uma URL')

    const player = this.client.music.join({
      guild,
      voiceChannel: this.memberChannel,
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