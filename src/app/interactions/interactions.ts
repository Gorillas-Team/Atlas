import type { Interaction } from 'discord.js'
import { Atlas } from '../Atlas.js'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction.js'
import { PingButtonInteraction } from './components/pingButton.js'
import { SearchMenuInteraction } from './components/searchMenu.js'

export type InteractionType = 'button' | 'menu'

export function loadInteractions(client: Atlas): Map<string, BaseDiscordInteraction> {
  const interactions = new Map<string, BaseDiscordInteraction>()
  const interactionFiles: BaseDiscordInteraction[] = [
    new PingButtonInteraction(client),
    new SearchMenuInteraction(client),
  ]

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
