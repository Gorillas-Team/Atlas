import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { SlashCommandBuilder } from 'discord.js'
import { t } from '@/shared/i18n/i18n.js'

export class SkipCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder().setName('skip').setDescription(t('command.skip.description'))
    )
  }

  async run({ guild, interaction }: CommandContext) {
    if (!guild) return void interaction.reply(t('command.notInGuild'))

    const userVoiceState = await guild.voiceStates.fetch(interaction.user.id)
    const botVoiceState = await guild.voiceStates.fetch(this.client.user!.id)
    if (!botVoiceState || !botVoiceState.channelId) {
      return void interaction.reply({
        content: t('command.skip.missingBotVoiceChannel'),
        flags: ['Ephemeral']
      })
    }

    if (userVoiceState.channelId !== botVoiceState.channelId) {
      return void interaction.reply({
        content: t('command.skip.notInSameVoiceChannel'),
        flags: ['Ephemeral']
      })
    }

    if (!userVoiceState || !userVoiceState.channelId) {
      return void interaction.reply({
        content: t('command.skip.missingUserVoiceChannel'),
        flags: ['Ephemeral']
      })
    }

    const player = this.client.lavalink.players.get(guild.id)
    if (!player) {
      return void interaction.reply(t('command.skip.playerNotFound'))
    }

    if (player.queue.length === 0) {
      return void interaction.reply(t('command.skip.noSongsInQueue'))
    }

    await player.stop()
    void interaction.reply(t('command.skip.success'))
  }
}
