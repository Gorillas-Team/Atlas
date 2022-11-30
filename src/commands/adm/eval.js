/* eslint-disable */
import Command from '../../lib/structures/Command.js'
import fetch from 'node-fetch'
import { inspect } from 'util'
import { codeBlock } from 'discord.js'

export default class Eval extends Command {
  constructor (client) {
    super(client)
    this.name = 'eval'
    this.hidden = true
    this.aliases = ['ev', 'e']
    this.category = 'adm'
  }

  async run ({ member, guild, me, author, channel, mentions, message, args, config }) {
    const code = args.join(' ').replace(/--\w+/g, '')
    const flags = args.join(' ').match(/--.+/g)
    const depth = 0
    try {
      let result = await eval(code)
      result = typeof result !== 'string' ? inspect(result, { depth }) : result
      if (result.length > 1700) {
        channel.send('Vou mandar na dm.')
        member.send('https://speedbin-new.glitch.me/' + (await fetch('https://speedbin-new.glitch.me/documents/', { method: 'POST', body: result })
          .then(r => r.json())
          .then(r => { return r.key })))
      }

      if (flags && flags.some(x => x.toLowerCase() === '--s' || x === '--silent')) return

      const jsString = result.replace(new RegExp(this.client.token, 'g'), '👍').replace(/require('child_process')/g, '')
      return codeBlock('js', jsString)
    } catch (e) {
      return codeBlock('js', e.message)
    }

    function exec (code) {
      return new Promise(function (res, rej) {
        require('child_process').exec(code, function (err, stdout) { err ? rej(err) : res(stdout) })
      })
    }
  }
}
