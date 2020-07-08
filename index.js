const AtlasClient = require('./src/AtlasClient')

const Atlas = new AtlasClient({
  token: process.env.TOKEN,
  environment: process.env.ENVIRONMENT,
  owners: process.env.OWNERS.split(','),
  prefixes: process.env.PREFIXES.split(','),
  nodes: JSON.parse(process.env.LAVALINK),
  presence: JSON.parse(process.env.PRESENCE || '{}'),
  logChannel: process.env.LOGCHANNEL
})

Atlas.start()