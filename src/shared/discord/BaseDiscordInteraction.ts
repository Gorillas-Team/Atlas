import { Atlas } from '@/app/Atlas.js'
import type { InteractionType } from '@/app/interactions/interactions.js'
import type { Interaction } from 'discord.js'

export abstract class BaseDiscordInteraction {
  client: Atlas
  id: string
  type: InteractionType

  constructor(client: Atlas, id: string, type: InteractionType) {
    this.client = client
    this.id = id
    this.type = type
  }

  abstract run(interaction: Interaction): Promise<void> | void
}
