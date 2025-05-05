import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../Atlas'
import { Ready } from './listeners/ready'
import { Events } from 'discord.js'
import { InteractionCreate } from './listeners/interactionCreate'
import { Raw } from './listeners/raw'

export function loadEvents(client: Atlas): Map<Events, BaseDiscordEvent> {
  const events = new Map<Events, BaseDiscordEvent>()
  const discordEvents: BaseDiscordEvent[] = [
    new Ready(client),
    new InteractionCreate(client),
    new Raw(client)
  ]

  for (const event of discordEvents) {
    events.set(event.eventName, event)
  }

  return events
}
