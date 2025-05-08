import axios, { Axios } from 'axios'
import { LavalinkPlayer, LavalinkPlayerState } from '../LavalinkPlayer.js'
import { LoadTracksResponse, LavalinkTrack } from '@/shared/lavalink/LavalinkPackets.js'

export class LavalinkApi {
  private client: Axios

  constructor(url: string, authentication: string) {
    this.client = axios.create({
      baseURL: `${url}/v4/`,
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
    noReplace = true
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

  public loadTracks(
    response: LoadTracksResponse,
    player: LavalinkPlayer,
    search: boolean = false
  ): LavalinkTrack[] {
    if (response.loadType === 'track') {
      player.queue.push(response.data)
      return [response.data]
    }

    if (response.loadType === 'playlist') {
      player.queue.push(...response.data.tracks)
      return response.data.tracks
    }

    if (response.loadType === 'search') {
      if (search) {
        return response.data
      }

      player.queue.push(response.data[0])
      return [response.data[0]]
    }

    if (response.loadType === 'empty' || response.loadType === 'error') {
      return []
    }

    return []
  }

  public async findTracks(query: string, source: string): Promise<LoadTracksResponse> {
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
