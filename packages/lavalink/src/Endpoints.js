export const BaseUrl = (host, port) => `${host}:${port}/v4`

export const WebSocketConnection = (host, port) => `ws://${BaseUrl(host, port)}/websocket`

export const RestApiUrl = (host, port) => `http://${BaseUrl(host, port)}`
export const LoadTracks = (query) => `/loadtracks?identifier=${query}`
export const UpdatePlayer = (sessionId, guildId) => `/sessions/${sessionId}/players/${guildId}`
