import { BaseDiscordEvent } from '@/shared/discord/BaseDiscordEvent.js'
import { Atlas } from '@/app/Atlas.js'
import { Events } from 'discord.js'

import {
  GatewayDispatchEvents,
  GatewayVoiceServerUpdateDispatch,
  GatewayVoiceStateUpdateDispatch
} from 'discord-api-types/v10'

export type RawPacket = (GatewayVoiceStateUpdateDispatch | GatewayVoiceServerUpdateDispatch) & {
  t: GatewayDispatchEvents
}

export class Raw extends BaseDiscordEvent {
  constructor(client: Atlas) {
    super(client, Events.Raw)
  }

  async run(packet: RawPacket) {
    const lavalink = this.client.lavalink
    const clientId = this.client.config.applicationId

    switch (packet.t) {
      case GatewayDispatchEvents.VoiceStateUpdate: {
        const { guild_id, channel_id, self_deaf, self_mute, user_id, session_id } = packet.d
        if (!guild_id || !user_id || clientId !== user_id) return

        if (channel_id === null) {
          // TODO: maybe destroy the player here
          lavalink.deleteVoiceState(user_id)
          return
        }

        await lavalink.updateVoiceState(guild_id, {
          guildId: guild_id,
          sessionId: session_id,
          voiceChannelId: channel_id,
          selfDeaf: self_deaf,
          selfMute: self_mute
        })
        break
      }

      case GatewayDispatchEvents.VoiceServerUpdate: {
        const { token, guild_id, endpoint } = packet.d
        if (!guild_id || !token || !endpoint) return

        await lavalink.updateVoiceServer(guild_id, { token, endpoint })
        break
      }

      default:
        break
    }
  }
}
