const Command = require('../../lib/structures/Command')
const { inspect } = require('util')

module.exports = class Eval extends Command {
  constructor(client) {
    super(client)
    this.name = 'eval'
    this.aliases = ['ev', 'e']
    this.category = 'adm'
  }

  async run({ member, guild, me, author, channel, mentions, message, args, config }) {
    var code = args.join(' ').replace(/--\w+/g, '')
    var flags = args.join(' ').match(/--.+/g)
    var depth = 0
    try {
      let result = await eval(code)
      result = typeof result !== 'string' ? inspect(result, { depth }) : result
      if (result.length > 1700){
        channel.send('Vou mandar na dm.')
        member.send('https://speedbin.xyz/' + (await fetch('https://speedbin.xyz/documents/', { method: 'POST', body: result })
          .then(r => r.json())
          .then(r => { return r.key })))
      }

      if (flags && flags.some(x => x.toLowerCase() === '--s' || x === '--silent')) return
      channel.send(result.replace(new RegExp(this.client.token, 'g'), '👍').replace(/require('child_process')/g, ''), { code: 'js' })
    } catch (e) { channel.send(e, { code: 'js' }) }

    function exec(code) {
      return new Promise(function (res, rej) {
        require('child_process').exec(code, function (err, stdout) { err ? rej(err) : res(stdout) })
      })
    }
  }
}