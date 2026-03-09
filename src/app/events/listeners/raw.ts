import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import { Events } from 'discord.js'
import { LavalinkVoiceHandler } from '@/app/events/handlers/LavalinkVoiceHandler.js'

import {
  GatewayDispatchEvents,
  type GatewayVoiceServerUpdateDispatch,
  type GatewayVoiceStateUpdateDispatch,
} from 'discord-api-types/v10'

export type RawPacket = (GatewayVoiceStateUpdateDispatch | GatewayVoiceServerUpdateDispatch) & {
  t: GatewayDispatchEvents
}

export class Raw extends BaseDiscordEvent {
  private readonly voiceHandler: LavalinkVoiceHandler

  constructor(client: Atlas) {
    super(client, Events.Raw)
    this.voiceHandler = new LavalinkVoiceHandler(client.lavalink, client.logger)
  }

  async run(packet: RawPacket) {
    try {
      switch (packet.t) {
        case GatewayDispatchEvents.VoiceStateUpdate:
          await this.voiceHandler.handleVoiceStateUpdate(packet.d, this.client.config.applicationId)
          break

        case GatewayDispatchEvents.VoiceServerUpdate:
          await this.voiceHandler.handleVoiceServerUpdate(packet.d)
          break
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.logger.error(`Error handling raw packet ${packet.t}: ${errorMessage}`)
    }
  }
}
