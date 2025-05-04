import { BaseDiscordEvent } from "@/shared/discord/BaseDiscordEvent";
import { Atlas } from "../../Atlas";

export class Ready extends BaseDiscordEvent<'ready'> {
    constructor(client: Atlas) {
        super(client, 'ready');
    }

    async run(client: Atlas) {
        this.logger.info(`Logged in as ${client.user?.tag}`);
    }
}