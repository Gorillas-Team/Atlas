import { Interaction } from 'discord.js'
import { Atlas } from '../Atlas'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction'
import { PingButtonInteraction } from './components/pingButton'

export type InteractionType = 'button' | 'menu'

export function loadInteractions(client: Atlas): Map<string, BaseDiscordInteraction> {
  const interactions = new Map<string, BaseDiscordInteraction>()
  const interactionFiles: BaseDiscordInteraction[] = [new PingButtonInteraction(client)]

  for (const interaction of interactionFiles) {
    interactions.set(interaction.id, interaction)
  }

  return interactions
}

export async function findAndRunInteraction(client: Atlas, interaction: Interaction) {
  if (!interaction.isMessageComponent()) return

  const type = interaction.isButton() ? 'button' : 'menu'
  const discordInteraction = client.findInteraction(interaction.customId, type)
  if (!discordInteraction) return

  await discordInteraction.run(interaction)
}
