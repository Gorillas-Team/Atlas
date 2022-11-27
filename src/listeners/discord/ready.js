import Listener from '../../lib/structures/Listener.js'
import LavalinkListenerLoader from '../../loaders/LavalinkListenerLoader.js'
import { REST, Routes } from 'discord.js'

export default class extends Listener {
  constructor () {
    super({
      name: 'ready',
      once: true
    })

    this.rest = new REST({ version: '10' }).setToken(this.token)
  }

  async run () {
    this.music.start(this.user.id)

    new LavalinkListenerLoader(this).load()

    const cmds = this.commands
      .filter(c => c.hidden === false)
      .map(c => {
        return {
          name: c.name,
          description: c.description || 'No description provided.',
          options: c.options || []
        }
      })

    await this.rest.put(Routes.applicationCommands(this.user.id), {
      body: cmds
    })

    console.log('[LOG] Online on client', this.user.username)
  }
}
