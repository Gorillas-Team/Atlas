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
    switch (packet.t) {
      case GatewayDispatchEvents.VoiceStateUpdate: {
        const { guild_id, channel_id, self_deaf, self_mute } = packet.d
        if (!guild_id || !channel_id) return

        this.client.lavalink.updateVoiceState(guild_id, {
          guildId: guild_id,
          voiceChannelId: channel_id,
          selfDeaf: self_deaf,
          selfMute: self_mute
        })
        break
      }
      case GatewayDispatchEvents.VoiceServerUpdate: {
        const { token, guild_id, endpoint } = packet.d
        if (!guild_id || !token || !endpoint) return

        this.client.lavalink.updateVoiceServer(guild_id, { token, endpoint })
        break
      }
      default:
        break
    }
  }
}
