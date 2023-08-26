import { SugarMap } from '@atlasbot/utils'
import { Node } from '@atlasbot/lavalink'

class Manager {
  /**
   * Creates a new instance of the Manager class.
   * @param {import('@atlasbot/discord').Client} client
   * @param {Array<{password:string, host:string, tag:string}>} nodes
   * @param {any} options
   */
  constructor (client, nodes, options) {
    this.client = client
    this.options = options
    /** @type {SugarMap<string, Node>} */
    this.nodes = new SugarMap()

    nodes.forEach((node) => {
      this.nodes.set(node.tag, new Node(this, node))
    })
  }

  updatePacket (packet) {
    switch (packet.t) {
      case 'VOICE_SERVER_UPDATE':
        this.updateVoiceServer(packet.d)
        break
      case 'VOICE_STATE_UPDATE':
        this.updateVoiceState(packet.d)
        break
      case 'GUILD_CREATE':
        for (const state of packet.d.voice_states) {
          this.updateVoiceState({ ...state, guild_id: packet.d.id })
        }
        break
    }
  }

  updateVoiceState (packet) {
    if (!packet.guild_id) return

    this.client.voiceStates.set(packet.guild_id, {
      session_id: packet.session_id,
      channel_id: packet.channel_id
    })
  }

  updateVoiceServer (packet) {
    if (!packet.guild_id) return
    this.client.voiceServers.set(packet.guild_id, packet)
  }

  async searchTrack (query, source) {
    // TODO: get ideal node
    const node = this.nodes.first()

    if (!/^https?:\/\//.test(query)) {
      query = `${source || 'yt'}search:${query}`
    }

    const result = await node.requester.get(`/loadtracks?identifier=${query}`)
    return result.body.json()
  }
}

export default Manager
