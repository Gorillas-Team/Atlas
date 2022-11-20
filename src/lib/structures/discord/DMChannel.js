/* eslint-disable */
const { Structures, MessageEmbed } = require('discord.js')

const replaceToken = (client, string) => string.replace(new RegExp(client.token, 'g'), '👍')
const replaceTokenObj = (client, obj) => JSON.parse(replaceToken(client, JSON.stringify(obj)))

Structures.extend('DMChannel', function (DMChannel) {
  return class extends DMChannel {
    constructor (...opts) {
      super(...opts)
    }

    send (...opts) {
      let [messageContent] = opts

      switch (typeof messageContent) {
        case 'string':
          messageContent = replaceToken(this.client, messageContent)

          return super.send(messageContent, ...opts.slice(1))
        case 'object':
          if (messageContent instanceof MessageEmbed) return super.send({ embed: replaceTokenObj(this.client, messageContent) })

          messageContent = replaceTokenObj(this.client, messageContent)

          return super.send(messageContent)
      }
    }
  }
})
