import type {
  GatewayVoiceServerUpdateDispatch,
  GatewayVoiceStateUpdateDispatch,
} from 'discord-api-types/v10'
import type { Logger } from 'pino'
import type { LavalinkClient } from '@/shared/lavalink/LavalinkClient.js'

export class LavalinkVoiceHandler {
  private readonly lavalink: LavalinkClient
  private readonly logger: Logger

  constructor(lavalink: LavalinkClient, logger: Logger) {
    this.lavalink = lavalink
    this.logger = logger
  }

  async handleVoiceStateUpdate(
    data: GatewayVoiceStateUpdateDispatch['d'],
    clientId: string,
  ): Promise<void> {
    const { guild_id, channel_id, self_deaf, self_mute, user_id, session_id } = data

    if (!guild_id || !user_id || clientId !== user_id) return

    if (channel_id === null && this.hasPlayer(guild_id)) {
      await this.destroyPlayer(guild_id)
    }

    await this.updateVoiceState(guild_id, {
      guildId: guild_id,
      sessionId: session_id,
      voiceChannelId: channel_id,
      selfDeaf: self_deaf,
      selfMute: self_mute,
    })
  }

  async handleVoiceServerUpdate(data: GatewayVoiceServerUpdateDispatch['d']): Promise<void> {
    const { token, guild_id, endpoint } = data

    if (!guild_id || !token || !endpoint) return

    await this.updateVoiceServer(guild_id, { token, endpoint })
  }

  private async destroyPlayer(guildId: string): Promise<void> {
    try {
      await this.lavalink.destroy(guildId)
    } catch (error) {
      this.logError(`Failed to destroy player for guild ${guildId}`, error)
    }
  }

  private async updateVoiceState(
    guildId: string,
    voiceState: Parameters<LavalinkClient['updateVoiceState']>[1],
  ): Promise<void> {
    try {
      await this.lavalink.updateVoiceState(guildId, voiceState)
    } catch (error) {
      this.logError(`Failed to update voice state for guild ${guildId}`, error)
    }
  }

  private async updateVoiceServer(
    guildId: string,
    voiceServer: Parameters<LavalinkClient['updateVoiceServer']>[1],
  ): Promise<void> {
    try {
      await this.lavalink.updateVoiceServer(guildId, voiceServer)
    } catch (error) {
      this.logError(`Failed to update voice server for guild ${guildId}`, error)
    }
  }

  private logError(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error)
    this.logger.error(`${message}: ${errorMessage}`)
  }

  private hasPlayer(guildId: string): boolean {
    return this.lavalink.players.has(guildId)
  }
}
