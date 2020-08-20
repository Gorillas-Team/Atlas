const { GorilinkManager } = require('gorilink')
const { MessageEmbed } = require('discord.js')

module.exports = class AtlasMusicManager extends GorilinkManager {
  constructor(client, nodes, options) {
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
  async musicSearchHandler({ query, requester, msg, player, type = 'track' }) {
    const { loadType, tracks, playlistInfo } = await this.fetchTracks(query)

    if (loadType === 'LOAD_FAILED' || loadType === 'NO_MATCHES')
      return msg.edit(`Não encontrei nada buscando por: \`${query}\``)

    if (loadType === 'PLAYLIST_LOADED') {
      if (tracks.length > 30) tracks.splice(30, tracks.length)

      player.queue.push(...tracks.map(t => Object.assign({ requester }, t)))

      return msg.edit(`Foram adicionadas \`${tracks.length}\` musicas da playlist \`${playlistInfo.name}\``)
    }

    if (loadType === 'TRACK_LOADED' || 'SEARCH_RESULT') {
      if (type === 'search' && loadType === 'SEARCH_RESULT') {
        tracks.splice(5, tracks.length)
        await msg.edit(new MessageEmbed()
          .setTitle('Seleção de musicas')
          .setDescription(tracks.map(track => `${tracks.indexOf(track) + 1}. [${track.info.title}](${track.info.uri})`))
          .setFooter('Tempo de resposta é de 15 segundos')
        )

        const coll = msg.channel.createMessageCollector(m => new RegExp('^([1-5])$', 'i') && m.author.id === requester.id, {
          max: 1, time: 15000
        })

        return coll.on('collect', async m => {
          player.queue.push(Object.assign({ requester }, tracks[m.content - 1]))
          await msg.edit(`A musica \`${tracks[m.content].info.title}\` foi adicionado a playlist por **${requester.user.username}**`, { embed: null })
        })
      }

      if (type === 'track') player.queue.push(Object.assign({ requester }, tracks[0]))
      return msg.edit(`A musica \`${tracks[0].info.title}\` foi adicionado a playlist por **${requester.user.username}**`)
    }
  }
}