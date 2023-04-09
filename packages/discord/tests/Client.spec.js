import { RequestUtils } from '@atlasbot/utils'
import { DiscordGateway, Client } from '@atlasbot/discord'
import { jest } from '@jest/globals'

describe('Client', () => {
  let client
  const token = 'abc123'

  beforeEach(() => {
    client = new Client(token)
    client.ws.login = jest.fn()
  })

  describe('constructor', () => {
    it('should set the token property', () => {
      expect(client._token).toBe(token)
    })

    it('should set the default options', () => {
      expect(client.intents).toBe(0)
      expect(client.shards).toBe(1)
    })

    it('should set the request property with the authorization header', () => {
      expect(client.request).toBeInstanceOf(RequestUtils)
      expect(client.request.headers.authorization).toBe(`Bot ${token}`)
    })

    it('should set the ws property with a DiscordGateway instance', () => {
      expect(client.ws).toBeInstanceOf(DiscordGateway)
      expect(client.ws.client).toBe(client)
    })
  })

  describe('login', () => {
    it('should call the ws login method', async () => {
      const login = jest.spyOn(client.ws, 'login')
      await client.login()
      expect(login).toHaveBeenCalled()
    })
  })
})
