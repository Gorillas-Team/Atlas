import { Atlas } from '@/app/Atlas.js'
import { BaseDiscordCommand, type CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { t } from '@/shared/i18n/i18n.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js'

export class PingCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder().setName('ping').setDescription(t('command.ping.description')),
    )
  }

  async run({ interaction }: CommandContext): Promise<void> {
    const button = new ButtonBuilder()
      .setCustomId('ping')
      .setEmoji('🏓')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button)

    await interaction.followUp({
      content: t('command.ping.message'),
      flags: MessageFlags.Ephemeral,
      components: [row],
    })
  }
}
