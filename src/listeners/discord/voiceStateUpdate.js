import Listener from '../../lib/structures/Listener.js'

export default class extends Listener {
  constructor() {
    super({
      name: 'voiceStateUpdate'
    })
  }

  run(VSOld, VSNew) {
    const player = this.music.players.get(VSOld.guild.id || VSNew.guild.id)

    if (!player) return
    let channel = this.channels.cache.get(player.voiceChannel.id || player.voiceChannel)

    if (VSNew.channelID !== channel.id && this.user.id === VSNew.id) {
      player.updateChannel(VSNew.channelID)
      channel = this.channels.cache.get(VSNew.channelID)
    }

    if (channel.members.size < 2) {
      player.channelEmpty = true
      player.execTimeout()
    } else {
      player.channelEmpty = false
      if (!player.playing) return player.execTimeout()
      player.execClearTimeout()
    }
  }
}