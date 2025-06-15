import { BaseDiscordCommand, type CommandContext } from '@/shared/discord/BaseDiscordCommand.js'
import { Atlas } from '@/app/Atlas.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  codeBlock,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { t } from '@/shared/i18n/i18n.js'
import { Duration } from 'luxon'
import type { LavalinkTrack } from '@/shared/lavalink/LavalinkPackets.js'
import { LavalinkPlayer } from '@/shared/lavalink/LavalinkPlayer.js'

export class QueueCommand extends BaseDiscordCommand {
  constructor(client: Atlas) {
    super(
      client,
      new SlashCommandBuilder().setName('queue').setDescription(t('command.queue.description')),
    )
  }

  run({ interaction, player }: CommandContext) {
    if (!player) {
      return void interaction.followUp(t('command.queue.notPlaying'))
    }

    if (!player.queue.length) {
      return void interaction.followUp(t('command.queue.queueEmpty'))
    }

    const currentPage = 1
    const { embed, row } = this.createQueue(player, currentPage)

    void interaction.followUp({
      embeds: [embed],
      flags: ['Ephemeral'],
      components: [row],
    })
  }

  createQueue(player: LavalinkPlayer, currentPage: number) {
    const size = this.client.config.queuePageSize
    const totalPages = Math.ceil(player.queue.length / size)
    const ensurePage = Math.min(Math.max(currentPage, 1), totalPages)
    const playlistInfo = this.parseQueueInfo(player.queue)
    const infoByPage = this.getItemsByPage(playlistInfo, ensurePage, size)
    const isFirstPage = ensurePage === 1
    const isLastPage = ensurePage === totalPages

    const embed = new EmbedBuilder()
      .setDescription(codeBlock('markdown', infoByPage.join('\n')))
      .setColor('Aqua')
      .setFooter({ text: t('command.queue.page', { page: ensurePage, total: totalPages }) })

    const previousPage = new ButtonBuilder()
      .setCustomId('previous_queue')
      .setLabel(t('command.queue.previous'))
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isFirstPage)

    const nextPage = new ButtonBuilder()
      .setCustomId('next_queue')
      .setLabel(t('command.queue.next'))
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isLastPage)

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      previousPage,
      nextPage,
    )

    return { embed, row }
  }

  shortenTitle(title: string, max: number) {
    return title.length > max ? title.slice(0, max - 3) + '...' : title.padEnd(max)
  }

  parseQueueInfo(queue: LavalinkTrack[]) {
    return queue.map((track, index) => {
      const { title, length } = track.info
      const song = this.shortenTitle(title, 35)
      const position = String(index + 1) + '.'
      const duration = Duration.fromMillis(length).toFormat('mm:ss')
      return t('command.queue.info', { position, song, duration })
    })
  }

  getItemsByPage(playlist: string[], currentPage: number, size: number) {
    const startIndex = (currentPage - 1) * size
    const endIndex = startIndex + size
    return playlist.slice(startIndex, endIndex)
  }
}
