export default class Channel {
  constructor (guild, data) {
    this.id = data.id
    this.name = data.name
    this.guild = guild
    this.type = data.type
    this.lastMessage = data.lastMessage || null
  }
}
