import { BaseDiscordCommand, type CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
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
          option.setName('query').setDescription(t('command.play.options.query')).setRequired(true),
        )
        .addStringOption(option =>
          option
            .setName('source')
            .setDescription('source')
            .setRequired(false)
            .addChoices(
              { name: 'youtube music', value: 'ytmsearch' },
              { name: 'spotify', value: 'spsearch' },
              { name: 'youtube', value: 'ytsearch' },
              { name: 'soundcloud', value: 'scsearch' },
            ),
        ),
    )
  }

  async run({ guild, interaction, options, channel }: CommandContext) {
    const query = options.getString('query')
    const source = options.getString('source') ?? 'ytsearch'

    if (!guild) {
      return void interaction.followUp({
        content: t('command.notInGuild'),
        flags: ['Ephemeral'],
      })
    }

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.followUp({
        content: t('command.play.missingVoiceChannel'),
        flags: ['Ephemeral'],
      })
    }

    const player = await this.client.lavalink.spawn(
      {
        guildId: guild.id,
        voiceChannelId: userVoiceState.channelId,
      },
      channel,
    )

    const tracks = await this.client.lavalink.findTracks(query!, source)
    if (tracks.length === 0) {
      return void interaction.followUp({
        content: t('command.play.notFound'),
        flags: ['Ephemeral'],
      })
    }

    if (tracks.length == 1) {
      const track = tracks[0] ?? null

      if (!track) {
        return void interaction.followUp({
          content: t('command.play.notFound'),
          flags: ['Ephemeral'],
        })
      }

      const title = track.info.title
      const duration = Duration.fromMillis(track.info.length).toFormat('mm:ss')

      void interaction.followUp({
        content: t('command.play.addedToQueue', { title, duration }),
        flags: ['Ephemeral'],
      })

      player.addTrack([track])
    }

    if (tracks.length > 1) {
      const toBeAdded = tracks.slice(0, 249)
      player.addTrack(toBeAdded)

      const length = toBeAdded.length
      void interaction.followUp({
        content: t('command.play.addedPlaylist', { length }),
        flags: ['Ephemeral'],
      })
    }

    if (player.state.paused) {
      await player.play()
    }
  }
}
