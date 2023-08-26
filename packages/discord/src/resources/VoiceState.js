export default class VoiceState {
  constructor (client, data) {
    this.client = client
    this.guildId = data.guild_id
    this.channelId = data.channel_id
    this.userId = data.user_id
    this.sessionId = data.session_id
    this.deaf = data.deaf
    this.mute = data.mute
    this.selfDeaf = data.self_deaf
    this.selfMute = data.self_mute
    this.suppress = data.suppress

    this.client.voiceStates.set(this.userId, this)
  }

  /**
   * @returns {import('@atlasbot/discord').Member}
   */
  get member () {
    return this.client.guilds.cache.get(this.guildId).members.get(this.userId)
  }
}
