import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { SlashCommandBuilder } from 'discord.js'
import { t } from '@/shared/i18n/i18n.js'

export class SkipCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(client, new SlashCommandBuilder().setName('skip').setDescription('pula'))
  }

  async run({ guild, interaction }: CommandContext) {
    if (!guild) return void interaction.reply('This command can only be used in a server.')

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.reply({
        content: t('command.play.missingVoiceChannel'),
        flags: ['Ephemeral']
      })
    }

    const player = this.client.lavalink.players.get(guild.id)
    if (!player) {
      return void interaction.reply('Player not found')
    }

    await player.stop()
    void interaction.reply('Music successfully skipped')
  }
}
