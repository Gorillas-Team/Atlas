import { Endpoints } from '@atlasbot/discord'

describe('Endpoints', () => {
  describe('Channel', () => {
    it('Shoud return channel endpoint', () => {
      const endpoint = Endpoints.Channel('1234')
      expect(endpoint).toBe('channels/1234')
    })

    it('Shoud return channel message endpoint', () => {
      const endpoint = Endpoints.ChannelMessage('1234')
      expect(endpoint).toBe('channels/1234/messages')
    })

    it('Shoud return channel message edit endpoint', () => {
      const endpoint = Endpoints.ChannelMessageEdit('1234', '5678')
      expect(endpoint).toBe('channels/1234/messages/5678')
    })
  })

  describe('Webhook', () => {
    it('Shoud return webhook endpoint', () => {
      const endpoint = Endpoints.Webhook('1234', 'abc')
      expect(endpoint).toBe('webhooks/1234/abc')
    })

    it('Shoud return webhook message endpoint', () => {
      const endpoint = Endpoints.WebhookMessage('1234', 'abc')
      expect(endpoint).toBe('webhooks/1234/abc/messages/@original')
    })
  })

  describe('Application Command', () => {
    it('Shoud return global application endpoint', () => {
      const endpoint = Endpoints.GlobalApplicationCommand('1234')
      expect(endpoint).toBe('applications/1234/commands')
    })

    it('Shoud return guild application endpoint', () => {
      const endpoint = Endpoints.GuildApplicationCommand('1234', '5678')
      expect(endpoint).toBe('applications/1234/guilds/5678/commands')
    })

    it('Shoud return global application edit endpoint', () => {
      const endpoint = Endpoints.GlobalApplicationCommandEdit('1234', '5678')
      expect(endpoint).toBe('applications/1234/commands/5678')
    })

    it('Shoud return guild application edit endpoint', () => {
      const endpoint = Endpoints.GuildApplicationCommandEdit('1234', '5678', '9012')
      expect(endpoint).toBe('applications/1234/guilds/5678/commands/9012')
    })
  })

  describe('Interaction', () => {
    it('Shoud return interaction endpoint', () => {
      const endpoint = Endpoints.Interaction('1234', 'abc')
      expect(endpoint).toBe('interactions/1234/abc/callback')
    })

    it('Shoud return interaction message endpoint', () => {
      const endpoint = Endpoints.InteractionMessage('1234', 'abc')
      expect(endpoint).toBe('interactions/1234/abc/callback/messages/@original')
    })
  })
})
