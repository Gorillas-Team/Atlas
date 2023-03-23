import test from 'ava'

import { Endpoints } from '@atlasbot/discord'

// Channel
test('Shoud return channel endpoint', (t) => {
  const endpoint = Endpoints.Channel('1234')
  t.is(endpoint, 'channels/1234')
})

test('Shoud return channel message endpoint', (t) => {
  const endpoint = Endpoints.ChannelMessage('1234')
  t.is(endpoint, 'channels/1234/messages')
})

test('Shoud return channel message edit endpoint', (t) => {
  const endpoint = Endpoints.ChannelMessageEdit('1234', '5678')
  t.is(endpoint, 'channels/1234/messages/5678')
})

// Webhook
test('Shoud return webhook endpoint', (t) => {
  const endpoint = Endpoints.Webhook('1234', 'abc')
  t.is(endpoint, 'webhooks/1234/abc')
})

test('Shoud return webhook message endpoint', (t) => {
  const endpoint = Endpoints.WebhookMessage('1234', 'abc')
  t.is(endpoint, 'webhooks/1234/abc/messages/@original')
})

// Application Command
test('Shoud return global application endpoint', (t) => {
  const endpoint = Endpoints.GlobalApplicationCommand('1234')
  t.is(endpoint, 'applications/1234/commands')
})

test('Shoud return guild application endpoint', (t) => {
  const endpoint = Endpoints.GuildApplicationCommand('1234', '5678')
  t.is(endpoint, 'applications/1234/guilds/5678/commands')
})

test('Shoud return global application edit endpoint', (t) => {
  const endpoint = Endpoints.GlobalApplicationCommandEdit('1234', '5678')
  t.is(endpoint, 'applications/1234/commands/5678')
})

test('Shoud return guild application edit endpoint', (t) => {
  const endpoint = Endpoints.GuildApplicationCommandEdit('1234', '5678', '9012')
  t.is(endpoint, 'applications/1234/guilds/5678/commands/9012')
})

// Interactions
test('Shoud return interaction endpoint', (t) => {
  const endpoint = Endpoints.Interaction('1234', 'abc')
  t.is(endpoint, 'interactions/1234/abc/callback')
})

test('Shoud return interaction message endpoint', (t) => {
  const endpoint = Endpoints.InteractionMessage('1234', 'abc')
  t.is(endpoint, 'interactions/1234/abc/callback/messages/@original')
})
