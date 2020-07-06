const { Listener } = require('../../lib/structures')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'message',
    })
  }

  run(msg) {
    if (msg.channel.type === 'dm' || msg.author.bot) return

    const prefix = this.config.prefixes.find(x => msg.content.toLowerCase().startsWith(x)) || msg.guild.me.toString().toLowerCase()

    if (!msg.content.toLowerCase().startsWith(prefix)) return

    const args = msg.content
      .trim().slice(prefix.length)
      .split(/ /g).filter(Boolean)

    if (!args[0]) return

    const cmd = args.shift().toLowerCase(),
      handler = this.commands.find(c => c.name === cmd || c.aliases.includes(cmd))

    if (handler) return handler.init(ctx({ client: this, message: msg, args }))
  }
}

function ctx({ client, message, args }) {
  return {
    guild: message.guild,
    me: message.guild.me,
    member: message.member,
    author: message.author,
    channel: message.channel,
    mentions: message.mentions,
    config: client.config,
    message,
    client,
    args,
  }
}
