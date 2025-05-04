import axios, { Axios } from "axios";
import { LavalinkPlayer, LavalinkSpawnOptions } from "../LavalinkPlayer";

export class LavalinkApi {
  private client: Axios

  constructor (url: string, authentication: string) {
    this.client = axios.create({
      baseURL: url,
      headers: {
        Authorization: authentication,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
  }

  async updatePlayer(options: LavalinkSpawnOptions, player: Partial<LavalinkPlayer>) {
    return await this.client.patch(this.getSessionEndpoint(options.sessionId, `players/${options.guildId}`), {
      ...player
    })
  }

  async deletePlayer(options: LavalinkSpawnOptions) {
    return await this.client.patch(this.getSessionEndpoint(options.sessionId, `players/${options.guildId}`))
  }

  private getSessionEndpoint(sessionId: string, path: string) {
    return `/sessions/${sessionId}/${path}`
  } 
}