import { Atlas } from '@/app/Atlas';
import { BaseDiscordCommand } from '@/shared/discord/BaseDiscordCommand.js';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export class PingCommand extends BaseDiscordCommand {
    constructor(client: Atlas) {
        super(
            client,
            new SlashCommandBuilder()
                .setName('ping')
                .setDescription('Ping the bot to check if it is alive'),
        );
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        this.logger.info('Ping command executed');
        await interaction.reply('Pong!');
    }
}
