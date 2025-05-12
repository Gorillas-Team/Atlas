import { Atlas } from './app/Atlas.js'
import { loadCommands } from './app/commands/commands.js'
import { getEnvJson, getEnvString, getEnvStringArray } from '@/shared/env.js'
import { loadEvents } from './app/events/events.js'
import { Environment, LogLevel } from './app/config.js'
import { loadInteractions } from './app/interactions/interactions.js'
import { GatewayIntentBits } from 'discord.js'

const bot = new Atlas({
  botToken: getEnvString('DISCORD_TOKEN'),
  config: {
    owners: getEnvStringArray('DISCORD_OWNERS'),
    applicationId: getEnvString('DISCORD_APPLICATION_ID'),
    lavalinkNodes: getEnvJson('LAVALINK_NODES', []),
    logLevel: getEnvString('LOG_LEVEL', 'info') as LogLevel,
    environment: getEnvString('NODE_ENV', 'development') as Environment,
    testGuildId: getEnvString('DISCORD_TEST_GUILD_ID') ?? null
  },
  clientOptions: {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMembers
    ]
  }
})

bot.setCommands(loadCommands(bot))
bot.setEvents(loadEvents(bot))
bot.setInteractions(loadInteractions(bot))

void bot.bootstrap()
void bot.login(getEnvString('DISCORD_TOKEN'))
