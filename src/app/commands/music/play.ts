import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Duration } from 'luxon'

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
    const query = interaction.options.getString('query')
    const source = interaction.options.getString('source') ?? 'ytsearch'
    const guild = interaction.guild

    if (!guild) {
      return void interaction.reply('This command can only be used in a server.')
    }

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.reply('You are not in a voice channel.')
    }

    const player = await this.client.lavalink.spawn({
      guildId: guild.id,
      voiceChannelId: userVoiceState.channelId
    })

    const tracks = await this.client.lavalink.findTracks(query!, source)
    if (tracks.length === 0) {
      return void interaction.reply('No tracks found.')
    }

    player.addTrack(tracks[0])
    await player.play()

    const title = tracks[0].info.title
    const duration = Duration.fromMillis(tracks[0].info.length).toFormat('mm:ss')

    void interaction.reply({
      content: `Tocando agora: **${title}** - **${duration}**`
    })
  }
}
