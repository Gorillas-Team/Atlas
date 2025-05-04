import { BaseDiscordCommand } from "@/shared/discord/BaseDiscordCommand";
import { Client, ClientEvents, REST, Routes } from "discord.js";
import { AtlasOptions } from "./config";
import { BaseDiscordEvent } from "@/shared/discord/BaseDiscordEvent";
import pino, { Logger } from "pino";

export class Atlas extends Client {
    public logger: Logger;
    public commands: Map<string, BaseDiscordCommand> = new Map();
    private events: Map<keyof ClientEvents, BaseDiscordEvent<keyof ClientEvents>> = new Map();
    private config: AtlasOptions['config'];
    private gateway: REST;

    constructor(options: AtlasOptions) {
        super({
            ...options,
        });

        this.config = options.config
        this.gateway = new REST({ version: '10' }).setToken(options.botToken);
        this.logger = pino({
            level: options.config.logLevel,
            name: 'Client',
        })
    }

    private async loadCommands() {
        const commandData = Array.from(this.commands.values()).map(command => command.data.toJSON());

        const applicationId = this.config.applicationId;
        if (!applicationId) {
            throw new Error("Client is not logged in or user ID is not available.");
        }

        try {
            if (this.config.environment === 'development' && this.config.testGuildId) {
                await this.gateway.put(Routes.applicationGuildCommands(applicationId, this.config.testGuildId), {
                    body: commandData,
                });

                this.logger.info('Successfully registered development commands');
                return;
            }

            if (this.config.environment === 'production') {
                await this.gateway.put(Routes.applicationCommands(applicationId), {
                    body: commandData,
                });

                this.logger.info('Successfully registered production commands');
                return;
            }

            throw new Error("Invalid environment. Use 'development' or 'production'.");
        } catch (error) {
            throw new Error(`Failed to register application commands: ${error}`);
        }
    }

    private async loadEvents() {
        for (const [eventName, event] of this.events) {
            this.on(eventName, (...args) => event.run(...args));
        }
    }

    public setCommands(commands: Map<string, BaseDiscordCommand>) {
        this.commands = commands;
    }

    public setEvents(events: Map<keyof ClientEvents, BaseDiscordEvent<keyof ClientEvents>>) {
        this.events = events;
    }

    public bootstrap() {
        this.loadEvents();
        this.loadCommands();
    }
}