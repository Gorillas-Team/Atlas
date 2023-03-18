import { BaseGatewayEvent, Guild } from '@atlasbot/discord'

export default class GuildCreateEvent extends BaseGatewayEvent {
  handle (data) {
    const guild = new Guild(data.d)

    const { cache, partials } = this.client.guilds

    if (data.d.unavailable) return partials.set(data.d.id, data.d)

    if (partials.has(data.d.id)) {
      cache.set(data.d.id, guild)
      partials.delete(data.d.id)

      for (const channel of guild.channels.values()) {
        this.client.channels.set(channel.id, channel)
      }

      return
    }

    this.client.emit('guildCreate', data.d)
  }
}
