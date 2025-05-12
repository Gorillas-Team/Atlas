export type OpType = 'ready' | 'playerUpdate' | 'stats' | 'event'

interface BasePacket {
  op: OpType
}

export interface ReadyPacket extends BasePacket {
  op: 'ready'
  resumed: boolean
  sessionId: string
}

export interface PlayerUpdatePacket extends BasePacket {
  op: 'playerUpdate'
  guildId: string
  state: PlayerState
}
export interface PlayerState {
  time: number // Unix ms
  position: number // ms
  connected: boolean
  ping: number // ms
}

export interface StatsPacket extends BasePacket {
  op: 'stats'
  players: number
  playingPlayers: number
  uptime: number // ms
  memory: MemoryStats
  cpu: CPUStats
  frameStats: FrameStats | null
}
export interface MemoryStats {
  free: number
  used: number
  allocated: number
  reservable: number
}
export interface CPUStats {
  cores: number
  systemLoad: number
  lavalinkLoad: number
}
export interface FrameStats {
  sent: number
  nulled: number
  deficit: number
}

export type EventType =
  | 'TrackStartEvent'
  | 'TrackEndEvent'
  | 'TrackExceptionEvent'
  | 'TrackStuckEvent'
  | 'WebSocketClosedEvent'

interface EventPacketBase extends BasePacket {
  op: 'event'
  type: EventType
  guildId: string
}

export interface TrackStartEventPacket extends EventPacketBase {
  type: 'TrackStartEvent'
  track: LavalinkTrack
}

export type TrackEndReason = 'finished' | 'loadFailed' | 'stopped' | 'replaced' | 'cleanup'

export interface TrackEndEventPacket extends EventPacketBase {
  type: 'TrackEndEvent'
  track: LavalinkTrack
  reason: TrackEndReason
}

export type Severity = 'common' | 'suspicious' | 'fault'
export interface ExceptionInfo {
  message?: string
  severity: Severity
  cause: string
}
export interface TrackExceptionEventPacket extends EventPacketBase {
  type: 'TrackExceptionEvent'
  track: LavalinkTrack
  exception: ExceptionInfo
}

export interface TrackStuckEventPacket extends EventPacketBase {
  type: 'TrackStuckEvent'
  track: LavalinkTrack
  thresholdMs: number
}

export interface WebSocketClosedEventPacket extends EventPacketBase {
  type: 'WebSocketClosedEvent'
  code: number
  reason: string
  byRemote: boolean
}

export type LoadResultType = 'track' | 'playlist' | 'search' | 'empty' | 'error'

export interface TrackInfo {
  identifier: string
  isSeekable: boolean
  author: string
  length: number
  isStream: boolean
  position: number
  title: string
  uri?: string
  artworkUrl?: string
  isrc?: string
  sourceName: string
}

export interface LavalinkTrack {
  encoded: string | null
  info: TrackInfo
  pluginInfo: Record<string, unknown>
  userData: Record<string, unknown>
}

export interface PlaylistInfo {
  name: string
  selectedTrack: number
}

export interface TrackResultData {
  encoded: string
  info: TrackInfo
  pluginInfo: Record<string, unknown>
  userData: Record<string, unknown>
}

export interface PlaylistResultData {
  info: PlaylistInfo
  pluginInfo: Record<string, unknown>
  tracks: LavalinkTrack[]
}

export interface ErrorResultData {
  message: string
  severity: 'common' | 'suspicious' | 'fault'
  cause?: string
}

export type LoadTracksResponse =
  | { loadType: 'track'; data: LavalinkTrack }
  | { loadType: 'playlist'; data: PlaylistResultData }
  | { loadType: 'search'; data: LavalinkTrack[] }
  | { loadType: 'empty'; data: unknown }
  | { loadType: 'error'; data: ErrorResultData }

export type LavalinkPacket =
  | ReadyPacket
  | PlayerUpdatePacket
  | StatsPacket
  | TrackStartEventPacket
  | TrackEndEventPacket
  | TrackExceptionEventPacket
  | TrackStuckEventPacket
  | WebSocketClosedEventPacket
