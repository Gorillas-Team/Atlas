import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../../Atlas'
import { Events } from 'discord.js'

export class Raw extends BaseDiscordEvent<Events.Raw> {
  constructor(client: Atlas) {
    super(client, Events.Raw)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(packet: any) {
    // TODO: handle voice state updates
    // TODO: handle voice server updates
  }
}
