const AtlasClient = require('./src/AtlasClient')
const banner = require('fs').readFileSync('./banner.txt').toString()

console.log(banner)

const Atlas = new AtlasClient({
  token: process.env.TOKEN,
  environment: process.env.ENVIRONMENT,
  owners: JSON.parse(process.env.OWNERS),
  prefixes: JSON.parse(process.env.PREFIXES),
  nodes: JSON.parse(process.env.LAVALINK),
  clientOptions: JSON.parse(process.env.CLIENT_OPTIONS || '{}'),
  logChannel: process.env.LOG_CHANNEL,
  leaveTimeout: process.env.LEAVE_TIMEOUT || null
})

Atlas.start()