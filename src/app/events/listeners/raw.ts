import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../../Atlas'
import { Events } from 'discord.js'

export class Raw extends BaseDiscordEvent<Events.Raw> {
  constructor(client: Atlas) {
    super(client, Events.Raw)
  }

  async run(paket: any) {
    // TODO: handle voice state updates
    // TODO: handle voice server updates
  }
}
