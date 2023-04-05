import { Client } from '@atlasbot/discord'

test('Shoud return client instance', () => {
  const client = new Client('token', { intents: 1, shards: 2 })

  expect(client).toBeInstanceOf(Client)
  expect(client._token).toBe('token')
  expect(client.intents).toBe(1)
  expect(client.shards).toBe(2)
})
