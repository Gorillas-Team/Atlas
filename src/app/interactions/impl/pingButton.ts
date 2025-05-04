import { Atlas } from "@/app/Atlas";
import { BaseDiscordInteraction } from "@/shared/discord/BaseDiscordInteraction";
import { ButtonInteraction, MessageFlags } from "discord.js";

export class PingButtonInteraction extends BaseDiscordInteraction {
  constructor (client: Atlas) {
    super(client, "ping", "button")
  }

  async run(interaction: ButtonInteraction) {
    await interaction.reply({
      content: "Pong!",
      flags: MessageFlags.Ephemeral
    })
  }
}