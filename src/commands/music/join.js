import Command from '../../lib/structures/Command.js'

export default class Join extends Command {
  constructor (client) {
    super(client)
    this.name = 'join'
    this.aliases = ['connect', 'j']
    this.category = 'music'

    this.conf = {
      voiceChannelOnly: true,
      checkPermissions: true
    }
  }

  run ({ guild, channel }) {
    const player = this.client.music.join({
      guild,
      voiceChannel: this.memberChannel,
      textChannel: channel
    })

    if (!player.playing) player.updateDj(guild)
    player.execTimeout()

    return '👌'
  }
}
