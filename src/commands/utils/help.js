import Command from '../../lib/structures/Command.js'
import { EmbedBuilder } from 'discord.js'

export default class Help extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['ajuda']
    this.description = 'Show all bot\'s commands'
    this.category = 'utils'
  }

  run () {
    const commands = this.client.commands.filter(({ hide, dev }) => !hide && !dev)
    const commandPerCategory = (category) => commands.filter(cmd => cmd.category === category)
    const mapCommand = (command) => `\`${command.name}\``

    const embed = new EmbedBuilder()
      .setTitle('🌐 | Central de comandos')
      .setColor(this.client.config.color)
      .addFields({
        name: `🎵 | Música [${commandPerCategory('music').size}]`,
        value: commandPerCategory('music').map(mapCommand).join(', ')
      }, {
        name: `🛠️ | Utilitários [${commandPerCategory('utils').size}]`,
        value: commandPerCategory('utils').map(mapCommand).join(', ')
      })

    return { embeds: [embed.toJSON()] }
  }
}
