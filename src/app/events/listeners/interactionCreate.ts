import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import {
  ChatInputCommandInteraction,
  Events,
  GuildMember,
  type Interaction,
  TextChannel,
} from 'discord.js'
import { findAndRunInteraction } from '@/app/interactions/interactions.js'
import { type CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { t } from '@/shared/i18n/i18n.js'

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
        flags: ['Ephemeral'],
      })
      return
    }

    try {
      if (interaction.isChatInputCommand()) {
        const context = await this.newContext(interaction)

        if (!context) {
          return void interaction.reply(t('command.notInGuild'))
        }

        await interaction.deferReply({ ephemeral: true })
        await command.run(context)
      } else {
        await interaction.reply({
          content: t('command.commandNotSupported'),
          flags: ['Ephemeral'],
        })
      }
    } catch (error) {
      this.logger.error(error)
      await interaction.followUp({
        content: t('command.somethingWentWrong'),
        flags: ['Ephemeral'],
      })
    }
  }

  async newContext(interaction: ChatInputCommandInteraction): Promise<CommandContext | null> {
    const guild = interaction.guild
    const channel = interaction.channel

    if (!guild || !(channel instanceof TextChannel) || !this.client.user) return null

    const players = this.client.lavalink.players
    const clientId = this.client.user.id
    const lavalinkPlayer = players.get(guild.id) ?? null
    const me = guild.members.cache.get(clientId) || (await guild.members.fetch(clientId))

    return {
      member: (interaction.member as GuildMember) || interaction.user,
      player: lavalinkPlayer,
      options: interaction.options,
      lavalink: this.client.lavalink,
      guild,
      channel,
      me,
      interaction,
    }
  }
}
