import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import { Events, Interaction } from 'discord.js'
import { findAndRunInteraction } from '@/app/interactions/interactions.js'

export class InteractionCreate extends BaseDiscordEvent {
  constructor(client: Atlas) {
    super(client, Events.InteractionCreate)
  }

  async run(interaction: Interaction) {
    if (!interaction.isCommand()) {
      void findAndRunInteraction(this.client, interaction)
      return
    }

    const command = this.client.commands.get(interaction.commandName)
    if (!command) {
      await interaction.reply({
        content: 'Comando não encontrado 😓',
        ephemeral: true
      })
      return
    }

    try {
      if (interaction.isChatInputCommand()) {
        await command.run(interaction)
      } else {
        await interaction.reply({
          content: 'Comando não suportado 😓',
          ephemeral: true
        })
      }
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Algo deu errado 😓',
        ephemeral: true
      })
    }
  }
}
