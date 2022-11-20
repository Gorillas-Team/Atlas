// TODO: update gorilink to ES Modules
import gorilink from 'gorilink'

import { EmbedBuilder } from 'discord.js'
const { GorilinkManager } = gorilink

export default class AtlasMusicManager extends GorilinkManager {
  constructor (client, nodes, options) {
    const nodesResumable = nodes.map(n => Object.assign({ resumeKey: Math.random().toString(36).slice(2) }, n))

    super(client, nodesResumable, options)
  }

  /**
   * Handle all search results it comes from lavalink nodes
   * @param {string} query query to search
   * @param {GuildMember} requester guild requester command requester
   * @param {Message} msg bot message
   * @param {AtlasPlayer} player guild player
   * @param {string} type type of playlist handle
   * @returns {Message} bot message updated
   */
  async musicSearchHandler ({ query, requester, msg, player, type = 'track' }) {
    const { loadType, tracks, playlistInfo } = await this.fetchTracks(query)

    if (loadType === 'LOAD_FAILED' || loadType === 'NO_MATCHES') { return msg.edit(`Não encontrei nada buscando por: \`${query}\``) }

    if (loadType === 'PLAYLIST_LOADED') {
      if (tracks.length > 30) tracks.splice(30, tracks.length)

      const limitedPlaylist = tracks.map(t => Object.assign({ requester }, t))

      player.queue.push(...limitedPlaylist)
      player.previousTrack = limitedPlaylist[0]

      return msg.edit(`Foram adicionadas \`${tracks.length}\` musicas da playlist \`${playlistInfo.name}\``)
    }

    if (loadType === 'TRACK_LOADED' || loadType === 'SEARCH_RESULT') {
      if (type === 'search' && loadType === 'SEARCH_RESULT') {
        tracks.splice(5, tracks.length)
        await msg.edit(new EmbedBuilder()
          .setTitle('Seleção de musicas')
          .setDescription(tracks.map(track => `${tracks.indexOf(track) + 1}. [${track.title}](${track.uri})`))
          .setFooter('Tempo de resposta é de 15 segundos')
        )

        const coll = msg.channel.createMessageCollector(m => m.author.id === requester.id, {
          max: 1, time: 15000
        })

        return coll.on('collect', async m => {
          const track = Object.assign({ requester }, tracks[m.content - 1])
          player.queue.push(track)
          player.previousTrack = track
          await msg.edit(`A musica \`${tracks[m.content].title}\` foi adicionado a playlist por **${requester.user.username}**`, { embed: null })
        })
      }

      if (type === 'track') {
        const track = Object.assign({ requester }, tracks[0])
        player.queue.push(track)
        player.previousTrack = track
      }

      return msg.edit(`A musica \`${tracks[0].title}\` foi adicionado a playlist por **${requester.user.username}**`)
    }
  }
}
