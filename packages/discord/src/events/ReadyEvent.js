import { SugarMap } from '@atlasbot/utils'
import { BaseGatewayEvent } from '@atlasbot/discord'

export default class ReadyEvent extends BaseGatewayEvent {
  handle (data) {
    this.client.v = data.d.v
    this.client.user = data.d.user

    const [cache, partials] = data.d.guilds.reduce((acc, guild) => {
      const collection = (guild.unavailable) ? acc[1] : acc[0]
      collection.set(guild.id, guild)
      return acc
    }, [new SugarMap(), new SugarMap()])

    this.client.guilds = {
      cache: new SugarMap(cache.map((g) => [g.id, g])),
      size: data.d.guilds.length,
      partials
    }

    this.client.application = data.d.application
    this.client.ws.resumeURL = data.d.session_id

    this.client.emit('ready', data.d)
  }
}
