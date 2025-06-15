import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '../Atlas.js'
import { Ready } from './listeners/ready.js'
import { Events } from 'discord.js'
import { InteractionCreate } from './listeners/interactionCreate.js'
import { Raw } from './listeners/raw.js'

export function loadEvents(client: Atlas): Map<Events, BaseDiscordEvent> {
  const events = new Map<Events, BaseDiscordEvent>()
  const discordEvents: BaseDiscordEvent[] = [
    new Ready(client),
    new InteractionCreate(client),
    new Raw(client),
  ]

  for (const event of discordEvents) {
    events.set(event.eventName, event)
  }

  return events
}
