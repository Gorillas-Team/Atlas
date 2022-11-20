import Listener from '../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'voiceStateUpdate'
    })
  }

  async run (VSOld, VSNew) {
    const player = this.music.players.get(VSOld.guild.id || VSNew.guild.id)

    if (!player) return
    if (!VSNew.channelId) return player.destroy()

    if (VSNew.channelId !== player.voiceChannel && VSNew.channel.members.size > 1 && VSNew.channel.members.get(this.user.id)) {
      if (player.channelEmpty) {
        player.channelEmpty = false
        player.execClearTimeout()
      }

      player.updateChannel(VSNew.channelId)
    } else if (VSNew.channelId === player.voiceChannel) {
      player.channelEmpty = false
      player.execClearTimeout()
    } else {
      player.channelEmpty = true
      player.execTimeout()
    }
  }
}
