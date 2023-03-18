import { RawEvents } from '../Constants.js'

import ReadyEvent from '../events/ReadyEvent.js'
import InteractionCreate from '../events/InteractionCreate.js'
import MessageCreateEvent from '../events/MessageCreate.js'
import GuildCreateEvent from '../events/GuildCreate.js'

export default class DispatcherManager {
  constructor (client) {
    this.events = {}

    this.register(RawEvents.READY, new ReadyEvent(client))
    this.register(RawEvents.INTERACTION_CREATE, new InteractionCreate(client))
    this.register(RawEvents.MESSAGE_CREATE, new MessageCreateEvent(client))
    this.register(RawEvents.GUILD_CREATE, new GuildCreateEvent(client))
  }

  register (name, event) {
    this.events[name] = event
  }

  handle (data) {
    const event = this.events[data.t]

    if (!event) return
    event.handle(data)
  }
}
