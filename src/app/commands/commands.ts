import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { PingCommand } from './util/ping.js'
import { Atlas } from '../Atlas.js'
import { PlayCommand } from '@/app/commands/music/play.js'
import { SkipCommand } from '@/app/commands/music/skip.js'
import { DisconnectCommand } from './music/disconnect.js'
import { SearchCommand } from './music/search.js'

export function loadCommands(client: Atlas): Map<string, BaseDiscordCommand> {
  const commands = new Map<string, BaseDiscordCommand>()
  const discordCommands: BaseDiscordCommand[] = [
    new PingCommand(client),
    new PlayCommand(client),
    new SkipCommand(client),
    new SearchCommand(client),
    new DisconnectCommand(client)
  ]

  for (const command of discordCommands) {
    commands.set(command.data.name, command)
  }

  return commands
}
