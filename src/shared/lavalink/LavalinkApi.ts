import axios, { Axios, type AxiosError } from 'axios'
import { LavalinkPlayer, type LavalinkPlayerState } from './LavalinkPlayer.js'
import { type LoadTracksResponse } from '@/shared/lavalink/LavalinkPackets.js'

export class LavalinkApi {
  private client: Axios

  constructor(url: string, authentication: string) {
    this.client = axios.create({
      baseURL: url,
      headers: {
        Authorization: authentication,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  private handleError(error: unknown, operation: string): never {
    const axiosError = error as AxiosError
    const statusCode = axiosError.response?.status
    const errorData = axiosError.response?.data
    const errorMessage = JSON.stringify(errorData) || axiosError.message || String(error)
    throw new Error(`${operation} (status: ${statusCode}): ${errorMessage}`)
  }

  public async getPlayer(sessionId: string, guildId: string): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to get player.')
    }

    try {
      const response = await this.client.get<LavalinkPlayer>(`${sessionId}/players/${guildId}`)
      return response.data
    } catch (error) {
      this.handleError(error, 'Failed to get player')
    }
  }

  public async updatePlayer(
    sessionId: string,
    guildId: string,
    player: LavalinkPlayerState,
    noReplace: boolean = true,
  ): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to update player.')
    }

    try {
      const response = await this.client.patch<LavalinkPlayer>(
        `sessions/${sessionId}/players/${guildId}`,
        player,
        {
          params: {
            noReplace,
          },
        },
      )
      return response.data
    } catch (error) {
      this.handleError(error, `Failed to update player for guild ${guildId}`)
    }
  }

  public async destroyPlayer(sessionId: string, guildId: string): Promise<void> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to destroy player.')
    }

    try {
      await this.client.delete(`sessions/${sessionId}/players/${guildId}`)
    } catch (error) {
      this.handleError(error, `Failed to destroy player for guild ${guildId}`)
    }
  }

  public async fetchTracks(query: string, source?: string): Promise<LoadTracksResponse> {
    try {
      let identifier = query

      if (!/^https?:\/\//.test(query) && source) {
        identifier = `${source}:${query}`
      }

      const response = await this.client.get<LoadTracksResponse>(
        `loadtracks?identifier=${encodeURIComponent(identifier)}`,
      )

      return response.data
    } catch (error) {
      this.handleError(error, `Failed to find tracks for query "${query}"`)
    }
  }
}
