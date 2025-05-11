import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import { ChatInputCommandInteraction, Events, GuildMember, Interaction } from 'discord.js'
import { findAndRunInteraction } from '@/app/interactions/interactions.js'
import { CommandContext } from '@/shared/discord/BaseDiscordCommand.js'

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
        flags: ['Ephemeral']
      })
      return
    }

    try {
      if (interaction.isChatInputCommand()) {
        const context = this.generateContext(interaction)
        await command.run(context)
      } else {
        await interaction.reply({
          content: 'Comando não suportado 😓',
          flags: ['Ephemeral']
        })
      }
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'Algo deu errado 😓',
        flags: ['Ephemeral']
      })
    }
  }

  generateContext(interaction: ChatInputCommandInteraction): CommandContext {
    const guild = interaction.guild
    const players = this.client.lavalink.players
    const lavalinkPlayer = (guild && players.get(guild.id)) ?? null

    return {
      guild: interaction.guild,
      channel: interaction.channel,
      member: (interaction.member as GuildMember) || interaction.user,
      player: lavalinkPlayer,
      options: interaction.options,
      interaction
    }
  }
}
