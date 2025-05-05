import { Atlas } from '@/app/Atlas'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { Logger } from 'pino'

export abstract class BaseDiscordCommand {
  logger: Logger
  data: SlashCommandBuilder
  client: Atlas

  constructor(client: Atlas, data: SlashCommandBuilder) {
    this.client = client
    this.data = data
    this.logger = client.logger.child({
      name: `Command-${this.constructor.name}`
    })
  }

  abstract run(interaction: ChatInputCommandInteraction): Promise<void> | void
}
