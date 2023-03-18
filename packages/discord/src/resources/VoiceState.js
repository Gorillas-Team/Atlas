export default class VoiceState {
  constructor (client, data) {
    this.client = client
    this.id = data.id
    this.guildId = data.guild_id
    this.channelId = data.channel_id
    this.userId = data.user_id
    this.member = data.member
    this.sessionId = data.session_id
    this.deaf = data.deaf
    this.mute = data.mute
    this.selfDeaf = data.self_deaf
    this.selfMute = data.self_mute
    this.suppress = data.suppress
  }
}
