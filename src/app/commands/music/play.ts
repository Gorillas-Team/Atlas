import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { SlashCommandBuilder } from 'discord.js'
import { Duration } from 'luxon'
import { t } from '@/shared/i18n/i18n.js'

export class PlayCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder()
        .setName('play')
        .setDescription(t('command.play.description'))
        .addStringOption(option =>
          option.setName('query').setDescription(t('command.play.options.query')).setRequired(true)
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

  async run({ guild, interaction, options }: CommandContext) {
    const query = options.getString('query')
    const source = options.getString('source') ?? 'ytsearch'

    if (!guild) {
      return void interaction.reply(t('command.notInGuild'))
    }

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.reply(t('command.play.missingVoiceChannel'))
    }

    const player = await this.client.lavalink.spawn({
      guildId: guild.id,
      voiceChannelId: userVoiceState.channelId
    })

    const tracks = await this.client.lavalink.findTracks(query!, source)
    if (tracks.length === 0) {
      return void interaction.reply(t('command.play.notFound'))
    }

    player.addTrack(tracks[0])
    if (player.state.paused) {
      await player.play()
    }

    const title = tracks[0].info.title
    const duration = Duration.fromMillis(tracks[0].info.length).toFormat('mm:ss')

    void interaction.reply({
      content: t('command.play.playingNow', { title, duration })
    })
  }
}
