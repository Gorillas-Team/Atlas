const { Listener } = require('../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'voiceStateUpdate'
    })
  }

  run(VSOld, VSnew) {
    const channel = VSnew.channel
    if(!channel) return

    if (channel.guild.me.voice.channel && channel.members.size < 2) {
      const player = this.music.players.get(channel.guild.id)

      player._leaveTimeout = setTimeout(() => {
        player.destroy()
        player.textChannel.send('😴 Saindo do canal por inatividade')
      }, player.leaveTimeout)
    }
  }
}