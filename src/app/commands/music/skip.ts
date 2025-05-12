import { BaseDiscordCommand, CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import { SlashCommandBuilder } from 'discord.js'

export class SkipCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(client, new SlashCommandBuilder().setName('skip').setDescription('pula'))
  }

  async run({ guild, interaction }: CommandContext) {
    if (!guild) return void interaction.reply('This command can only be used in a server.')

    const player = this.client.lavalink.players.get(guild.id)
    if (!player) {
      return void interaction.reply('Player not found')
    }

    await player.stop()
    void interaction.reply('Music skipped successfully')
  }
}
