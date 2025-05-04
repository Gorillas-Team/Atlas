import { Atlas } from "./app/Atlas";
import { loadCommands } from "./app/commands/commands";
import { getEnvJson, getEnvString, getEnvStringArray } from "@/shared/env.js"
import { loadEvents } from "./app/events/events";
import { Environment, LogLevel } from "./app/config";

const bot = new Atlas({
    botToken: getEnvString('DISCORD_TOKEN'),
    config: {
        owners: getEnvStringArray('DISCORD_OWNERS'),
        applicationId: getEnvString('DISCORD_APPLICATION_ID'),
        lavalinkNodes: getEnvJson('LAVALINK_NODES', []),
        logLevel: getEnvString('LOG_LEVEL', 'info') as LogLevel,
        environment: getEnvString('NODE_ENV', 'development') as Environment,
        testGuildId: getEnvString('DISCORD_TEST_GUILD_ID', undefined) ?? null,
    },
    intents: []
})

bot.setCommands(loadCommands(bot));
bot.setEvents(loadEvents(bot));
bot.bootstrap();
bot.login(getEnvString('DISCORD_TOKEN'));