import { Atlas } from '@/app/Atlas.js'
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js'
import { Logger } from 'pino'

export type SlashCommandData = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder

export abstract class BaseDiscordCommand {
  logger: Logger
  data: SlashCommandData
  client: Atlas

  constructor(client: Atlas, data: SlashCommandData) {
    this.client = client
    this.data = data
    this.logger = client.logger.child({
      name: `Command-${this.constructor.name}`
    })
  }

  abstract run(interaction: ChatInputCommandInteraction): Promise<void> | void
}
