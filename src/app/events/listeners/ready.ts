import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../../Atlas'
import { Events } from 'discord.js'

export class Ready extends BaseDiscordEvent<Events.ClientReady> {
  constructor(client: Atlas) {
    super(client, Events.ClientReady)
  }

  async run(client: Atlas) {
    this.logger.info(`Logged in as ${client.user?.tag}`)
  }
}
