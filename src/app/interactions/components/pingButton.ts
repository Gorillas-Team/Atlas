import { Atlas } from '@/app/Atlas.js'
import { BaseDiscordInteraction } from '@/shared/discord/BaseDiscordInteraction.js'
import { t } from '@/shared/i18n/i18n.js'
import { ButtonInteraction, codeBlock, EmbedBuilder } from 'discord.js'

export class PingButtonInteraction extends BaseDiscordInteraction {
  constructor(client: Atlas) {
    super(client, 'ping', 'button')
  }

  async run(interaction: ButtonInteraction) {
    const shards = this.client.ws.shards.map(shard => ({
      id: ((shard.id + 1).toString() + '.').padEnd(2),
      ping: shard.ping === -1 ? 'n/a' : `${shard.ping}ms`,
    }))

    const shardCount = this.client.ws.shards.size
    const shardMap = shards.map(shard => `${shard.id} ${shard.ping}`).join('\n')

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(t('command.ping.embed.title'))
      .setDescription(
        t('command.ping.embed.description', {
          shardMap: codeBlock('markdown', shardMap),
          shardCount,
        }),
      )
      .setTimestamp()

    await interaction.update({
      content: t('command.ping.response'),
      components: [],
      embeds: [embed],
    })
  }
}
