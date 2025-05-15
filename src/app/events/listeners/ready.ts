import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import { Events } from 'discord.js'

export class Ready extends BaseDiscordEvent {
  constructor(client: Atlas) {
    super(client, Events.ClientReady)
  }

  run(client: Atlas) {
    this.logger.info(`Logged in as ${client.user?.tag}`)
  }
}
