const { Listener } = require('../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'voiceStateUpdate'
    })
  }

  run(VSOld, VSNew) {
    const player = this.music.players.get(VSOld.guild.id || VSNew.guild.id)

    if(!player) return
    const channel = this.channels.cache.get(player.voiceChannel)

    if(channel.members.size < 2){
      player.channelEmpty = true
      player.execTimeout()
    } else {
      player.channelEmpty = false
      if(!player.playing) return player.execTimeout()
      player.execClearTimeout()
    }
  }
}