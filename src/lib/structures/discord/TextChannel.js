const { Structures } = require('discord.js')

const replaceToken = (client, string) => string.replace(new RegExp(client.token, 'g'), '👍')

Structures.extend('TextChannel', function (TextChannel) {
  return class extends TextChannel {
    constructor(...opts) {
      super(...opts)
    }

    send(...opts) {
      let [messageContent] = opts

      switch (typeof messageContent) {
      case 'string':
        messageContent = replaceToken(this.client, messageContent)
        super.send(messageContent, ...opts.slice(1))

        break
      case 'object':
        const { content } = messageContent
        messageContent = { content: replaceToken(this.client, content), ...messageContent }

        super.send(messageContent)
        break
      }
    }
  }
})