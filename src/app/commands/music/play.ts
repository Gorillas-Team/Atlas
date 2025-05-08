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

    if (!api) {
      return void interaction.reply('No Lavalink node available.')
    }

    const searchData = await api?.findTracks(query, source)
    if (!searchData) {
      return void interaction.reply('No results found.')
    }

    const userVoiceState = this.client.lavalink.getVoiceState(interaction.user.id)
    if (!userVoiceState) {
      return void interaction.reply('You are not in a voice channel.')
    }

    this.client.joinVoiceChannel(interaction.guildId!, userVoiceState.voiceChannelId!)
    const selfVoiceState = this.client.lavalink.getVoiceState(this.client.user!.id)
    if (!selfVoiceState) {
      return void interaction.reply('Bot is not in a voice channel.')
    }

    const player = this.client.lavalink.spawn({
      guildId: interaction.guildId!,
      voiceChannelId: userVoiceState.voiceChannelId,
      sessionId: selfVoiceState.sessionId
    })

    const voiceServer = this.client.lavalink.getVoiceServer(interaction.guildId!)
    if (!voiceServer) {
      return void interaction.reply('No voice server available.')
    }

    if (!searchData) return
    const tracks = api.loadTracks(searchData, player, true)

    if (tracks.length === 0) {
      return void interaction.reply('No tracks found.')
    }

    if (!player.node.sessionId) {
      return void interaction.reply('Player session ID is missing.')
    }

    player.state.track = tracks[0]
    player.setVoice({
      endpoint: voiceServer.endpoint,
      token: voiceServer.token,
      sessionId: selfVoiceState.sessionId
    })

    await api.updatePlayer(player.node.sessionId, player.guildId, player.state)

    void interaction.reply({
      content: `Playing **${tracks[0].info.title}** from **${tracks[0].info.author}**`,
      flags: 64
    })
  }
}
