/* eslint-disable camelcase */
import * as Endpoints from './Endpoints.js'

class Player {
  constructor (manager, node, options) {
    /** @type {import('@atlasbot/lavalink').Manager} */
    this.manager = manager
    /** @type {import('@atlasbot/lavalink').Node} */
    this.node = node

    this.guildId = options.guildId

    this.channelId = options.channelId
  }

  async play (track) {
    const url = Endpoints.UpdatePlayer(this.node.sessionId, this.guildId)

    // console.log(this.manager.client.voiceStates)
    // console.log(this.channelId)
    // console.log(this.manager.client.voiceStates.get(this.channelId))

    const packet = {
      track,
      voice: {
        token,
        endpoint,
        sessionId: session_id
      }
    }

    const result = await this.node.requester.patch(url, packet)

    return result.json()
  }
}

export default Player
