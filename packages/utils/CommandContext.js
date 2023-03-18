export const createBaseContext = ({ client, args }) => ({ client, args })

export const createCommandContext = (payload) => {
  const baseCtx = createBaseContext(payload)

  if ('interaction' in payload) { return Object.assign({ interaction: payload.interaction }, baseCtx) }

  return ({ message: payload.message, ...baseCtx })
}

// Response.send
// interaction.reply
// message.send

// Response.edit
// interaction.editReply
// message.edit

/*
({
  player: '',
  message,
  client,
  args,
})
*/
