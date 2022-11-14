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

    if (player.voiceChannel.id === VSOld.channelID) {
      if (VSOld.channel.members.size === 1) {
        player.channelEmpty = true
        player.execTimeout()
      }
    } else if (player.voiceChannel.id === VSNew.channelID) {
      if (VSNew.channel.members.size > 1) {
        player.channelEmpty = false
        player.execClearTimeout()
      }
    }
  }
}
