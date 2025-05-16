export const en = {
  command: {
    play: {
      description: 'Play a song, or many, in the current voice channel you are connected',
      missingVoiceChannel: 'You are not in a voice channel.',
      notFound: 'No tracks found.',
      playingNow: 'Now playing: **{{title}}** - **{{duration}}**',
      addedToQueue: 'Added to queue: **{{title}}** - **{{duration}}**',
      addedPlaylist: '{{length}} tracks were successfully added to the queue',
      options: {
        query: 'Song name',
      },
    },
    skip: {
      description: 'Skip the current song',
      missingUserVoiceChannel: 'You are not in a voice channel.',
      missingBotVoiceChannel: 'I am not in a voice channel.',
      notInSameVoiceChannel: 'You are not in the same voice channel as me.',
      noSongsInQueue: 'No songs in the queue to skip.',
      playerNotFound: 'Player not found',
      success: 'Music successfully skipped',
    },
    disconnect: {
      description: 'Disconnect from voice channel',
      success: 'Disconnected from voice channel',
    },
    search: {
      description: 'Send a song list based on informed query',
      options: {
        query: 'Song name',
      },
    },
    notInGuild: 'This command can only be used in a server.',
  },
} as const
