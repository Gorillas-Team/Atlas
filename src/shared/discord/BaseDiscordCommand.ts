import { Atlas } from '@/app/Atlas.js'
import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  TextChannel,
  User
} from 'discord.js'
import { Logger } from 'pino'
import { LavalinkPlayer } from '../lavalink/LavalinkPlayer.js'
import { LavalinkClient } from '../lavalink/LavalinkClient.js'

export type SlashCommandData = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
export type CommandContext = {
  channel: TextChannel
  guild: Guild
  member: GuildMember | User
  interaction: ChatInputCommandInteraction
  options: ChatInputCommandInteraction['options']
  player: LavalinkPlayer | null
  lavalink: LavalinkClient
  me: GuildMember
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
