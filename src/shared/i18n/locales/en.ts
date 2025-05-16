export const en = {
  command: {
    play: {
      description: 'Play a song or playlist in your current voice channel.',
      missingVoiceChannel: 'You need to be in a voice channel to use this command.',
      notFound: 'No tracks found matching your search.',
      playingNow: 'Now playing: **{{title}}** — **{{duration}}**',
      addedToQueue: 'Queued: **{{title}}** — **{{duration}}**',
      addedPlaylist: '`{{length}}` tracks added to the queue.',
      options: {
        query: 'Song title or keyword',
      },
    },
    skip: {
      description: 'Skip the song currently playing.',
      missingUserVoiceChannel: 'You must be in a voice channel to skip songs.',
      missingBotVoiceChannel: "I'm not connected to a voice channel.",
      notInSameVoiceChannel: 'You need to be in the same voice channel as me to skip.',
      noSongsInQueue: 'There are no songs in the queue to skip.',
      playerNotFound: 'No active player found.',
      success: 'Skipped to the next track.',
    },
    disconnect: {
      description: 'Leave the voice channel.',
      success: 'Disconnected from the voice channel.',
    },
    search: {
      description: 'Get a list of songs matching your search.',
      options: {
        query: 'Song title or keyword',
      },
    },
    queue: {
      description: 'Show the current song queue.',
      notPlaying: 'Nothing is currently playing.',
      queueEmpty: 'The queue is empty.',
      info: '{{position}} [{{duration}}] {{song}}',
      page: 'Page {{page}} of {{total}}',
      previous: 'Previous',
      next: 'Next',
    },
    ping: {
      description: 'Check the if the bot is online.',
      message: 'Ping?',
      response: 'Pong!',
      embed: {
        title: 'Ping per shard',
        description: '{{shardMap}}\nTotal shards: {{shardCount}}',
      },
    },
    notInGuild: 'This command can only be used within a server.',
  },
} as const
