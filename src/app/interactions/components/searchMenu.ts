import { Atlas } from '@/app/Atlas.js'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction.js'
import { t } from '@/shared/i18n/i18n.js'
import { StringSelectMenuInteraction } from 'discord.js'
import { Duration } from 'luxon'

export class SearchMenuInteraction extends BaseDiscordInteraction {
  constructor(client: Atlas) {
    super(client, 'search-menu', 'menu')
  }

  async run(interaction: StringSelectMenuInteraction) {
    if (!interaction.guild) {
      return
    }

    const player = this.client.lavalink.players.get(interaction.guild.id)
    if (!player) {
      return
    }

    const selected = interaction.values[0]
    const [track] = await this.client.lavalink.findTracks(selected)
    player.addTrack([track])

    const title = track.info.title
    const duration = Duration.fromMillis(track.info.length).toFormat('mm:ss')

    void interaction.reply({
      content: t('command.play.addedToQueue', { title, duration }),
      flags: ['Ephemeral']
    })

    if (player.state.paused) {
      await player.play()
    }
  }
}
