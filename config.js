module.exports = {
  token: process.env.TOKEN,
  environment: process.env.ENVIRONMENT,
  owners: process.env.OWNERS.split(','),
  prefixes: process.env.PREFIXES.split(','),
  lavalink: JSON.parse(process.env.LAVALINK),
  presence: JSON.parse(process.env.PRESENCE || '{}')
}