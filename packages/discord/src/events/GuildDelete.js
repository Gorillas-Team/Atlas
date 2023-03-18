import { BaseGatewayEvent, Guild } from '@atlasbot/discord'

export default class GuildDelete extends BaseGatewayEvent {
  handle (data) {
    const guild = new Guild(this.client, data.d)
    const cached = this.client.guilds.cache.get(data.d.id)

    if (cached) {
      this.client.guilds.cache.delete(data.d.id)

      for (const channel of cached.channels.values()) {
        this.client.channels.cache.delete(channel.id)
      }
    }

    this.client.emit('guildDelete', guild)
  }
}
