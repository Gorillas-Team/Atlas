import { Atlas } from '@/app/Atlas.js'
import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { t } from '@/shared/i18n/i18n.js'
import {
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel
} from 'discord.js'

export class SearchCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder()
        .setName('search')
        .setDescription(t('command.search.description'))
        .addStringOption(option =>
          option
            .setName('query')
            .setDescription(t('command.search.options.query'))
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('source')
            .setDescription('source')
            .setRequired(false)
            .addChoices(
              { name: 'youtube music', value: 'ytmsearch' },
              { name: 'youtube', value: 'ytsearch' },
              { name: 'soundcloud', value: 'scsearch' }
            )
        )
    )
  }

  async run({ guild, interaction, options, channel }: CommandContext) {
    const query = options.getString('query')
    const source = options.getString('source') ?? 'ytsearch'

    if (/^https?:\/\//.test(query!)) {
      return void interaction.reply('Query must not be an URL')
    }

    if (!guild) {
      return void interaction.reply({
        content: t('command.notInGuild'),
        flags: ['Ephemeral']
      })
    }

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.reply({
        content: t('command.play.missingVoiceChannel'),
        flags: ['Ephemeral']
      })
    }

    const player = await this.client.lavalink.spawn({
      guildId: guild.id,
      voiceChannelId: userVoiceState.channelId
    })

    player.textChannel = channel as TextChannel

    const search = (await this.client.lavalink.findTracks(query!, source, true)).slice(0, 9)

    const tracks = search.map(track =>
      new StringSelectMenuOptionBuilder().setLabel(track.info.title).setValue(track.info.identifier)
    )

    const selectMenu = new StringSelectMenuBuilder()
      .setPlaceholder('Select your song!')
      .setCustomId('search-menu')
      .setMaxValues(1)
      .setOptions(tracks)

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(selectMenu)

    void interaction.reply({
      content: `Select a track below from the query: ${query}`,
      flags: ['Ephemeral'],
      components: [row]
    })
  }
}
