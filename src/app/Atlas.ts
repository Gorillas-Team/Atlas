import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand'
import { Client, Events, REST, Routes } from 'discord.js'
import { AtlasOptions } from './config'
import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import pino, { Logger } from 'pino'
import { LavalinkClient } from '@/shared/lavalink/LavalinkClient'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction'
import { InteractionType } from './interactions/interactions'

export class Atlas extends Client {
  public logger: Logger
  public commands: Map<string, BaseDiscordCommand> = new Map()
  public interactions: Map<string, BaseDiscordInteraction> = new Map()
  public lavalink: LavalinkClient
  public config: AtlasOptions['config']
  // new Map<Events, BaseDiscordEvent<Events>>()
  private events: Map<Events, BaseDiscordEvent<Events>> = new Map()
  private gateway: REST

  constructor(options: AtlasOptions) {
    super({ ...options })

    const { config, botToken } = options

    this.config = config

    this.logger = pino({
      name: 'Discord-Client',
      level: config.logLevel
    })

    this.lavalink = new LavalinkClient(
      {
        clientId: config.applicationId,
        logLevel: config.logLevel
      },
      config.lavalinkNodes
    )

    this.gateway = new REST({ version: '10' }).setToken(botToken)
  }

  private async loadCommands() {
    const commandData = Array.from(this.commands.values()).map(command =>
      command.data.toJSON()
    )

    const applicationId = this.config.applicationId
    if (!applicationId) {
      throw new Error('Client is not logged in or user ID is not available.')
    }

    try {
      if (
        this.config.environment === 'development' &&
        this.config.testGuildId
      ) {
        await this.gateway.put(
          Routes.applicationGuildCommands(
            applicationId,
            this.config.testGuildId
          ),
          {
            body: commandData
          }
        )

        this.logger.info('Successfully registered development commands')
        return
      }

      if (this.config.environment === 'production') {
        await this.gateway.put(Routes.applicationCommands(applicationId), {
          body: commandData
        })

        this.logger.info('Successfully registered production commands')
        return
      }

      throw new Error("Invalid environment. Use 'development' or 'production'.")
    } catch (error) {
      throw new Error(`Failed to register application commands: ${error}`)
    }
  }

  private async loadEvents() {
    for (const [eventName, event] of this.events) {
      this.on(eventName as string, (...args) => event.run(...args))
    }
  }

  public setCommands(commands: Map<string, BaseDiscordCommand>) {
    this.commands = commands
  }

  public setEvents(
    events: Map<Events, BaseDiscordEvent<Events>>
  ) {
    this.events = events
  }

  public setInteractions(
    interactions: Map<string, BaseDiscordInteraction>
  ) {
    this.interactions = interactions
  }

  public findInteraction(id: string, type: InteractionType): BaseDiscordInteraction | null {
    return this.interactions.values().find(interaction => interaction.id === id && interaction.type === type) ?? null
  }

  public bootstrap() {
    this.loadEvents()
    this.loadCommands()
  }
}
