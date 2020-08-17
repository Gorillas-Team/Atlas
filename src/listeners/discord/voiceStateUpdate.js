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

    const player = this.music.players.get(channel.guild.id)

    if (channel.guild.me.voice.channel && channel.members.size < 2) {
      if(!player) return

      player.channelEmpty = true
      player.execTimeout()
    } else player ? player.channelEmpty = false : null
  }
}