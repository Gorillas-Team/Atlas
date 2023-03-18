import { Client } from '@atlasbot/discord'

const client = new Client(process.env.TOKEN, {
  intents: 641
})

client.on('ready', () => {
  console.log('on')
})

// client.on('messageCreate', async (message) => {
// if (message.author.bot) return
// console.log(message.type)

// // // const msg = await client.sendMessage(message.channel.id, {
// // // // content: 'running from scratch!'
// })

// // // await client.editMessage(msg, {
// // content: 'yes!'
// })

// client.deleteMessage(msg)
// .then(() => client.emit('destroy'))
// })

client.on('interactionCreate', async (interaction) => {
  // console.log('int', interaction)
  await client.interactionReply(interaction, {
    type: 4,
    data: {
      content: 'Hello World!'
    }
  })

  setTimeout(() => {
    client.interactionEdit(interaction, interaction.id, {
      content: 'alo?!'
    }).then(console.log)
  }, 1000)

  setTimeout(() => {
    client.interactionDelete(interaction, interaction.id).then(console.log)
  }, 2000)
})

client.once('destroy', () => {
  client.ws.destroy()
  process.exit(0)
})

client.login()
