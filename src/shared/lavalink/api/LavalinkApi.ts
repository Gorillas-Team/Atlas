import axios, { Axios } from "axios";
import { LavalinkPlayer } from "../LavalinkPlayer";

export class LavalinkApi {
  private client: Axios

  constructor(url: string, authentication: string) {
    this.client = axios.create({
      baseURL: `${url}/v4/`,
      headers: {
        Authorization: authentication,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
  }

  public async getPlayer(sessionId: string, guildId: string): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error("Session ID and Guild ID are required to get player.")
    }

    try {
      const response = await this.client.get(`${sessionId}/players/${guildId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to get player: ${error}`)
    }
  }

  public async updatePlayer(sessionId: string, guildId: string, player: LavalinkPlayer): Promise<LavalinkPlayer> {
    if (!sessionId || !guildId) {
      throw new Error("Session ID and Guild ID are required to get player.")
    }

    try {
      const response = await this.client.patch(`${sessionId}/players/${guildId}`, player)
      return response.data
    } catch (error) {
      throw new Error(`Failed to get player: ${error}`)
    }
  }
}