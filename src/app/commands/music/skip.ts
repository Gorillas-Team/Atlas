import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class SkipCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(client, new SlashCommandBuilder().setName('skip').setDescription('pula'))
  }

  async run(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild
    if (!guild) return

    const player = this.client.lavalink.players.get(guild.id)
    if (!player) {
      return void interaction.reply('nao to tocando')
    }

    await player.skip()
    void interaction.reply('pula')
  }
}
