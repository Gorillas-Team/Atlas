import { LavalinkNodeOptions } from '@/shared/lavalink/LavalinkNode.js'
import { ClientOptions } from 'discord.js'

export type LogLevel = 'info' | 'debug' | 'warn' | 'error'
export type Environment = 'development' | 'production'

export type AtlasConfig = {
  owners: string[]
  lavalinkNodes: LavalinkNodeOptions[]
  applicationId: string
  logLevel: LogLevel
  environment: Environment
  testGuildId: string | null
}

export type AtlasOptions = {
  config: AtlasConfig
  botToken: string
  clientOptions: ClientOptions
}
