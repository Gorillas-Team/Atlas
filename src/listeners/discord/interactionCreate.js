import Listener from '../../lib/structures/Listener.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'interactionCreate'
    })
  }

  async run (interaction) {
    if (!interaction.isChatInputCommand()) return

    const cmd = interaction.commandName.toLowerCase()
    const handler = this.commands.find(c => c.name === cmd || c.aliases.includes(cmd))
    const me = interaction.guild.members.cache.get(this.user.id)

    if (handler) return handler.init(ctx({ client: this, interaction, me }))
  }
}

function ctx ({ client, interaction, me }) {
  return {
    isInteraction: true,
    guild: interaction.guild,
    member: interaction.member,
    author: interaction.user,
    channel: interaction.channel,
    mentions: null,
    config: client.config,
    options: interaction.options,
    interaction,
    client,
    me
  }
}
