import { Atlas } from '@/app/Atlas.js'
import { Events } from 'discord.js'
import { Logger } from 'pino'

export abstract class BaseDiscordEvent {
  logger: Logger
  eventName: Events
  client: Atlas

  constructor(client: Atlas, eventName: Events) {
    this.client = client
    this.eventName = eventName
    this.logger = client.logger.child({
      name: `Event-${this.constructor.name}`
    })
  }

  abstract run(...args: any[]): Promise<void> | void
}
