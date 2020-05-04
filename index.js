const AtlasClient = require('./src/AtlasClient')
const config = require('./config')

const Atlas = new AtlasClient(config)

Atlas.start()