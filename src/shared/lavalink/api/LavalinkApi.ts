import axios, { Axios } from 'axios'
import { LavalinkPlayer } from '../LavalinkPlayer.js'

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
    player: LavalinkPlayer
  ): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error('Session ID and Guild ID are required to get player.')
    }

    try {
      const response = await this.client.patch<LavalinkPlayer>(
        `${sessionId}/players/${guildId}`,
        player
      )
      return response.data
    } catch (error) {
      throw new Error(
        `Failed to update player: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }
}
