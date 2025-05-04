import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand';
import { PingCommand } from './util/ping';
import { Atlas } from '../Atlas';

export function loadCommands(client: Atlas): Map<string, BaseDiscordCommand> {
    const commands = new Map<string, BaseDiscordCommand>();

    const discordCommands: BaseDiscordCommand[] = [
        new PingCommand(client),
    ];

    for (const command of discordCommands) {
        commands.set(command.data.name, command);
    }

    return commands;
}