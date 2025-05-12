import { Atlas } from '@/app/Atlas.js'
import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  TextBasedChannel,
  User
} from 'discord.js'
import { Logger } from 'pino'
import { LavalinkPlayer } from '../lavalink/LavalinkPlayer.js'
import { LavalinkClient } from '../lavalink/LavalinkClient.js'

export type SlashCommandData = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
export type CommandContext = {
  channel: TextBasedChannel | null
  guild: Guild | null
  member: GuildMember | User
  interaction: ChatInputCommandInteraction
  options: ChatInputCommandInteraction['options']
  player: LavalinkPlayer | null
  lavalink: LavalinkClient
  me: GuildMember | null
}

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

  abstract run(interaction: CommandContext): Promise<void> | void
}
