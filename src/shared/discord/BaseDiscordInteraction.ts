import { Atlas } from '@/app/Atlas'
import { InteractionType } from '@/app/interactions/interactions'
import { Interaction } from 'discord.js'

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
