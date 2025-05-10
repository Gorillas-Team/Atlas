import axios, { Axios } from 'axios'
import { LavalinkPlayer, LavalinkPlayerState } from './LavalinkPlayer.js'
import { LoadTracksResponse } from '@/shared/lavalink/LavalinkPackets.js'

export class LavalinkApi {
  private client: Axios

  constructor(url: string, authentication: string) {
    this.client = axios.create({
      baseURL: url,
      headers: {
        Authorization: authentication,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
  }

  public async getPlayer(sessionId: string, guildId: string): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to get player.')
    }

    try {
      const response = await this.client.get<LavalinkPlayer>(`${sessionId}/players/${guildId}`)
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to get player: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  public async updatePlayer(
    sessionId: string,
    guildId: string,
    player: LavalinkPlayerState,
    noReplace: boolean = true
  ): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to get player.')
    }

    try {
      const response = await this.client.patch<LavalinkPlayer>(
        `sessions/${sessionId}/players/${guildId}`,
        player,
        {
          params: {
            noReplace
          }
        }
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to update player: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  public async destroyPlayer(sessionId: string, guildId: string): Promise<void> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to get player.')
    }

    try {
      await this.client.delete(`sessions/${sessionId}/players/${guildId}`)
    } catch (error) {
      throw new Error(
        `Failed to destroy player: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  public async fetchTracks(query: string, source: string): Promise<LoadTracksResponse> {
    try {
      const response = await this.client.get<LoadTracksResponse>(
        `loadtracks?identifier=${source}:${query}`
      )

      return response.data
    } catch (error) {
      throw new Error(
        `Failed to find tracks: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}
