const AtlasClient = require('./src/AtlasClient')
const banner = require('fs').readFileSync('./banner.txt').toString()

console.log(banner)

const Atlas = new AtlasClient({
  token: process.env.TOKEN,
  environment: process.env.ENVIRONMENT,
  owners: JSON.parse(process.env.OWNERS),
  prefixes: JSON.parse(process.env.PREFIXES),
  nodes: JSON.parse(process.env.LAVALINK),
  presence: JSON.parse(process.env.PRESENCE || '{}'),
  logChannel: process.env.LOGCHANNEL,
  leaveTimeout: process.env.LEAVETIMEOUT || null
})

Atlas.start()