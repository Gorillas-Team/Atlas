import Listener from '../../../lib/structures/Listener.js'

export default class extends Listener {
  constructor() {
    super({
      name: 'trackError',
      type: 'lavalink'
    })
  }

  run(player, track, data) {
    player.textChannel.send(`Algo deu errado ao tocar a musica: \`${track.title}\``)
    console.log('An unexpected error happened on', player.guild.id, track, data)
  }
}