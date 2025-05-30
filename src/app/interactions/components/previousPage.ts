import { Atlas } from '@/app/Atlas.js'
import { QueueCommand } from '@/app/commands/music/queue.js'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction.js'
import { t } from '@/shared/i18n/i18n.js'
import { ButtonInteraction } from 'discord.js'

export class PreviousPageInteraction extends BaseDiscordInteraction {
  constructor(client: Atlas) {
    super(client, 'previous_queue', 'button')
  }

  run(interaction: ButtonInteraction) {
    if (!interaction.guild) {
      return
    }

    const queueCommand = this.client.commands.get('queue')

    if (!(queueCommand instanceof QueueCommand)) {
      throw new Error('Queue command not registered')
    }

    const guildId = interaction.guild.id
    const player = this.client.lavalink.players.get(guildId)

    if (!player || !player.queue?.length) {
      return void interaction.update({
        content: t('command.queue.notPlaying'),
        embeds: [],
        components: [],
      })
    }

    const messageId = interaction.message.id
    const cache = this.client.cache.queuePageIndex
    const previousPage = (cache.getValue(interaction.message.id) ?? 1) - 1
    const ensurePage = Math.max(previousPage, 1)
    const { embed, row } = queueCommand.createQueue(player, ensurePage)

    cache.setValue(messageId, ensurePage)

    void interaction.update({
      embeds: [embed],
      components: [row],
    })
  }
}
