export const en = {
  command: {
    play: {
      description: 'ele toca',
      missingVoiceChannel: 'You are not in a voice channel.',
      notFound: 'No tracks found.',
      playingNow: 'Tocando agora: **{{title}}** - **{{duration}}**',
      options: {
        query: 'nome da musica'
      }
    },
    disconnect: {
      description: 'Disconnect from voice channel',
      success: 'Disconnected from voice channel'
    },
    notInGuild: 'This command can only be used in a server.'
  }
} as const
