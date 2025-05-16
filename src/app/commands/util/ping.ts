import { Atlas } from '@/app/Atlas.js'
import { BaseDiscordCommand, type CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
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
      new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping the bot to check if it is alive'),
    )
  }

  async run({ interaction }: CommandContext): Promise<void> {
    this.logger.info('Ping command executed')

    const button = new ButtonBuilder()
      .setCustomId('ping')
      .setEmoji('🏓')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button)

    await interaction.reply({
      content: 'Ping?',
      flags: MessageFlags.Ephemeral,

      components: [row],
    })
  }
}
