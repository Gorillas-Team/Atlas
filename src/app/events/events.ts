import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../Atlas'
import { Ready } from './listeners/ready'
import { Events } from 'discord.js'
import { InteractionCreate } from './listeners/interactionCreate'
import { Raw } from './listeners/raw'

export function loadEvents(client: Atlas): Map<Events, BaseDiscordEvent<Events>> {
  const events = new Map<Events, BaseDiscordEvent<Events>>()
  const discordEvents: BaseDiscordEvent<Events>[] = [new Ready(client), new InteractionCreate(client), new Raw(client)]

  for (const event of discordEvents) {
    events.set(event.eventName, event)
  }

  return events
}
