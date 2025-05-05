import { Atlas } from '@/app/Atlas'
import { Events } from 'discord.js'
import { Logger } from 'pino'

export class BaseDiscordEvent<T extends Events> {
  logger: Logger
  eventName: T
  client: Atlas

  constructor(client: Atlas, eventName: T) {
    this.client = client
    this.eventName = eventName
    this.logger = client.logger.child({
      name: `Event-${this.constructor.name}`
    })
  }

  async run(...args: any): Promise<void> {
    throw new Error("Method 'run' not implemented.")
  }
}
