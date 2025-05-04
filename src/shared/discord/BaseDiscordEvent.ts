import { Atlas } from '@/app/Atlas'
import { ClientEvents } from 'discord.js'
import { Logger } from 'pino'

export class BaseDiscordEvent<T extends keyof ClientEvents> {
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
