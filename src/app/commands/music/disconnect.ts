import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { SlashCommandBuilder } from 'discord.js'
import { t } from '@/shared/i18n/i18n.js'

export class DisconnectCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription(t('command.disconnect.description'))
    )
  }

  run({ guild, interaction, lavalink }: CommandContext) {
    if (!guild) {
      return void interaction.reply({
        content: t('command.notInGuild'),
        flags: ['Ephemeral']
      })
    }

    this.client.voiceState({ guildId: guild.id, voiceChannelId: null })
    void lavalink.destroy(guild.id)
    void interaction.reply(t('command.disconnect.success'))
  }
}
