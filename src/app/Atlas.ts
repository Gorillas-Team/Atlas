import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js'
import { Client, Events, REST, Routes } from 'discord.js'
import type { AtlasConfig, AtlasOptions } from './config.js'
import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { pino, type Logger } from 'pino'
import { LavalinkClient, type LavalinkVoiceState } from '@/shared/lavalink/LavalinkClient.js'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction.js'
import { type InteractionType } from './interactions/interactions.js'
import { CacheManager } from '@/shared/Utils/CacheManager.js'

type ClientCaches = {
  queuePageIndex: CacheManager<string, number>
}

export class Atlas extends Client {
  public logger: Logger
  public commands: Map<string, BaseDiscordCommand> = new Map()
  public interactions: Map<string, BaseDiscordInteraction> = new Map()
  public lavalink: LavalinkClient
  public config: AtlasConfig
  public cache: ClientCaches = {
    queuePageIndex: new CacheManager(),
  }
  private events: Map<Events, BaseDiscordEvent> = new Map()
  private gateway: REST

  constructor(options: AtlasOptions) {
    super(options.clientOptions)

    const { config, botToken } = options

    this.config = config

    this.logger = pino({
      name: 'Discord-Client',
      level: config.logLevel,
    })

    this.lavalink = new LavalinkClient(
      {
        clientId: config.applicationId,
        logLevel: config.logLevel,
      },
      config.lavalinkNodes,
      this.voiceState.bind(this),
    )

    this.gateway = new REST({ version: '10' }).setToken(botToken)
  }

  private async loadCommands() {
    const commandData = Array.from(this.commands.values()).map(command => command.data.toJSON())

    const applicationId = this.config.applicationId
    if (!applicationId) {
      throw new Error('Client is not logged in or user ID is not available.')
    }

    try {
      const { testGuildId, environment } = this.config
      if (environment === 'development' && testGuildId) {
        const route = Routes.applicationGuildCommands(applicationId, testGuildId)
        await this.gateway.put(route, { body: commandData })

        this.logger.info('Successfully registered development commands')
        return
      }

      if (environment === 'production') {
        const route = Routes.applicationCommands(applicationId)
        await this.gateway.put(route, { body: commandData })

        this.logger.info('Successfully registered production commands')
        return
      }

      throw new Error("Invalid environment. Use 'development' or 'production'.")
    } catch (error: unknown) {
      throw new Error(`Failed to register application commands: ${(error as Error).message}`)
    }
  }

  private loadEvents() {
    for (const [eventName, event] of this.events) {
      this.on(eventName as string, (...args: unknown[]) => {
        try {
          void event.run(...args)
        } catch (error) {
          this.logger.error(`Error in event ${eventName}: ${(error as Error).message}`)
        }
      })
    }
  }

  public setCommands(commands: Map<string, BaseDiscordCommand>) {
    this.commands = commands
  }

  public setEvents(events: Map<Events, BaseDiscordEvent>) {
    this.events = events
  }

  public setInteractions(interactions: Map<string, BaseDiscordInteraction>) {
    this.interactions = interactions
  }

  public findInteraction(id: string, type: InteractionType): BaseDiscordInteraction | null {
    return (
      Array.from(this.interactions.values()).find(
        (interaction: BaseDiscordInteraction) => interaction.id === id && interaction.type === type,
      ) ?? null
    )
  }

  public voiceState(voiceState: LavalinkVoiceState) {
    const { guildId, voiceChannelId, selfDeaf, selfMute } = voiceState

    const shardId = this.guilds.cache.get(guildId)?.shardId ?? 0

    const payload = {
      op: 4,
      d: {
        guild_id: guildId,
        channel_id: voiceChannelId,
        self_mute: selfMute ?? false,
        self_deaf: selfDeaf ?? true,
      },
    }

    const shard = this.ws.shards.get(shardId)
    if (!shard) {
      this.logger.error(`Shard ${shardId} not found for guild ${guildId}`)
      return
    }

    shard.send(payload)
  }

  public async bootstrap() {
    this.loadEvents()
    await this.loadCommands()
  }
}
