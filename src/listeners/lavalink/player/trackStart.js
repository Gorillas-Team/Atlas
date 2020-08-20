const { Listener } = require('../../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'trackStart',
      type: 'lavalink'
    })
  }

  run(player, track) {
    if(player.lastMessage && !player.lastMessage.deleted) player.lastMessage.delete()
    player.textChannel.send(`Tocando agora \`${track.info.title}\``)
      .then(m => player.lastMessage = m)

    player.updateDj(this.client.guilds.get(player.get(guild.id).guild))

    if(player._leaveTimeout) player.execClearTimeout()
  }
}