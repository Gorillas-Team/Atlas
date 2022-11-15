// require('./src/lib/structures/discord')

import AtlasClient from './src/AtlasClient.js'
import { readFileSync } from 'fs'
const banner = readFileSync('assets/banner.txt').toString()

console.log(banner)

const Atlas = new AtlasClient({
  token: process.env.TOKEN,
  environment: process.env.ENVIRONMENT,
  owners: process.env.OWNERS.split(','),
  prefixes: process.env.PREFIXES.split(','),
  nodes: JSON.parse(process.env.LAVALINK),
  clientOptions: JSON.parse(process.env.CLIENT_OPTIONS || '{}'),
  logChannel: process.env.LOG_CHANNEL,
  leaveTimeout: process.env.LEAVE_TIMEOUT || null,
  color: process.env.COLOR || 0xFFFFFF,
  intents: process.env.INTENTS || 37507
})

Atlas.start()
