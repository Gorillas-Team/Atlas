import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { PingCommand } from './util/ping.js'
import { Atlas } from '../Atlas.js'
import { PlayCommand } from '@/app/commands/music/play.js'

export function loadCommands(client: Atlas): Map<string, BaseDiscordCommand> {
  const commands = new Map<string, BaseDiscordCommand>()
  const discordCommands: BaseDiscordCommand[] = [new PingCommand(client), new PlayCommand(client)]

  for (const command of discordCommands) {
    commands.set(command.data.name, command)
  }

  return commands
}
