import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent'
import { Atlas } from '../../Atlas'
import { Events, Interaction } from 'discord.js'
import { findAndRunInteraction } from '@/app/interactions/interactions'

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
      await interaction.reply({ content: 'Command not found', ephemeral: true })
      return
    }

    try {
      if (interaction.isChatInputCommand()) {
        await command.run(interaction)
      } else {
        await interaction.reply({
          content: 'This command type is not supported.',
          ephemeral: true
        })
      }
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
