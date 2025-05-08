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

  run(packet: RawPacket) {
    const lavalink = this.client.lavalink
    const clientId = this.client.config.applicationId

    switch (packet.t) {
      case GatewayDispatchEvents.VoiceStateUpdate: {
        const { guild_id, channel_id, self_deaf, self_mute, user_id, session_id } = packet.d
        if (!guild_id || !user_id) return

        if (channel_id === null) {
          lavalink.deleteVoiceState(user_id)

          if (clientId === user_id) {
            // TODO: maybe destroy the player here
            lavalink.deleteVoiceServer(guild_id)
          }

          return
        }

        lavalink.updateVoiceState(user_id, {
          guildId: guild_id,
          voiceChannelId: channel_id,
          selfDeaf: self_deaf,
          selfMute: self_mute,
          sessionId: session_id
        })
        break
      }

      case GatewayDispatchEvents.VoiceServerUpdate: {
        const { token, guild_id, endpoint } = packet.d
        if (!guild_id || !token || !endpoint) return

        lavalink.updateVoiceServer(guild_id, { token, endpoint })
        break
      }

      default:
        break
    }
  }
}
