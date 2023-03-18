// export const User = (userId) => `/users/${userId}`
export const Channel = (channelId) => `channels/${channelId}`
export const ChannelMessage = (channelId) => `${Channel(channelId)}/messages`
export const ChannelMessageEdit = (channelId, messageId) => `${ChannelMessage(channelId)}/${messageId}`

export const Webhook = (webhookId, token) => `webhooks/${webhookId}/${token}`
export const WebhookMessage = (webhookId, token, messageId) => `${Webhook(webhookId, token)}/messages/@original`

export const GlobalApplicationCommand = (applicationId) => `applications/${applicationId}/commands`
export const GuildApplicationCommand = (applicationId, guildId) => `applications/${applicationId}/guilds/${guildId}/commands`

export const GlobalApplicationCommandEdit = (applicationId, commandId) => `${GlobalApplicationCommand(applicationId)}/${commandId}`
export const GuildApplicationCommandEdit = (applicationId, guildId, commandId) => `${GuildApplicationCommand(applicationId, guildId)}/${commandId}`

export const Interaction = (interactionId, interactionToken) => `interactions/${interactionId}/${interactionToken}/callback`
export const InteractionMessage = (interactionId, interactionToken, messageId) => `${Interaction(interactionId, interactionToken)}/messages/@original`
