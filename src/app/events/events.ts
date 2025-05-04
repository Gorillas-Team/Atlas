import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../Atlas'
import { Ready } from './listeners/ready'
import { ClientEvents } from 'discord.js'
import { InteractionCreate } from './listeners/interactionCreate'

export function loadEvents(
  client: Atlas
): Map<keyof ClientEvents, BaseDiscordEvent<keyof ClientEvents>> {
  const events = new Map<
    keyof ClientEvents,
    BaseDiscordEvent<keyof ClientEvents>
  >()

  const discordEvents = [
    new Ready(client),
    new InteractionCreate(client)
  ] as BaseDiscordEvent<keyof ClientEvents>[]

  for (const event of discordEvents) {
    events.set(event.eventName, event)
  }

  return events
}
