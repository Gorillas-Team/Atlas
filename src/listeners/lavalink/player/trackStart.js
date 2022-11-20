import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'trackStart',
      type: 'lavalink'
    })
  }

  async run (player, track) {
    if (player.lastMessage && !player.lastMessage.deletable) player.lastMessage.then(m => m.delete())
    const m = player.textChannel.send(`Tocando agora \`${track.title}\``)

    player.lastMessage = m

    if (player._leaveTimeout) player.execClearTimeout()
  }
}
