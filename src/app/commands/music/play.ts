import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class PlayCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder()
        .setName('play')
        .setDescription('ele toca')
        .addStringOption(option =>
          option.setName('query').setDescription('nome da musica').setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('source')
            .setDescription('source')
            .setRequired(false)
            .addChoices(
              { name: 'youtube', value: 'ytsearch' },
              { name: 'youtube music', value: 'ytmsearch' },
              { name: 'soundcloud', value: 'scsearch' }
            )
        )
    )
  }

  async run(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString('query') as string
    const source = interaction.options.getString('source') ?? 'ytsearch'

    const api = this.client.lavalink.getBestNode().api
    const searchData = await api?.findTracks(query, source)
    if (!searchData) return
    const tracks = api?.loadTracks(searchData, true)

    if (!(tracks instanceof Array)) return

    interaction.reply(tracks.map(track => track.info.title).join('\n'))
  }
}
