import Listener from '../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'messageCreate'
    })
  }

  run (msg) {
    if (msg.channel.type === 'dm' || msg.author.bot) return

    const prefix = this.config.prefixes.find(x => msg.content.toLowerCase().startsWith(x))

    if (!msg.content.toLowerCase().startsWith(prefix)) return

    const args = msg.content
      .trim().slice(prefix.length)
      .split(/ /g).filter(Boolean)

    if (!args[0]) return

    const cmd = args.shift().toLowerCase()
    const handler = this.commands.find(c => c.name === cmd || c.aliases.includes(cmd))
    const me = msg.guild.members.cache.get(this.user.id)

    if (handler) return handler.init(ctx({ client: this, message: msg, args, me }))
  }
}

function ctx ({ client, message, args, me }) {
  return {
    guild: message.guild,
    member: message.member,
    author: message.author,
    channel: message.channel,
    mentions: message.mentions,
    config: client.config,
    message,
    client,
    args,
    me
  }
}
