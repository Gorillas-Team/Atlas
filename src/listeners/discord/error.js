const { Listener } = require('../../lib/structures')
const { inspect } = require('util')

module.exports = class extends Listener {
  constructor() {
    super({
      name: 'error',
      once: true
    })
  }

  async run(error) {
    const channel = this.client.channels.cache.get(this.config.logChannel)
    const hooks = await channel.fetchWebhooks()

    const webhook = hooks.cache.size === 0 ? channel.createWebhook('AtlasHook', { avatar: this.user.displayAvatarURL({ format: 'png' }), reason: 'Log channel'}) : hooks.first()

    webhook.send(inspect(error, { depth: 0 }), { code: 'js' }).catch(e => console.error('can\'t send Error hook:', e))
  }
}