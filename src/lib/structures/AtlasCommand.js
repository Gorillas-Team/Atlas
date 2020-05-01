module.exports = class AtlasCommand {
	constructor(client) {
		this.client = client;
        this.name = undefined;
        this.category = undefined;
        this.description = undefined;
		this.aliases = [];
        this.hidden = false;
	}

	init({ guild, me, author, channel, mentions, message, embed, args, member, lavalink = this.client.lavalink }) {
		if(this.hidden && !this.client.config.owners.includes(author.id)) return;

		try {
			this.run({guild, me, author, channel, mentions, message, embed, args, member, lavalink });
		} catch(err) {
			channel.send(`Algo deu extremamente errado ao executar esse comando por favor entrem em contato com a equipe de desenvolvimento usando o commando \`suport\`\`\`\`js${err}\`\`\``);
		}
	}

	run() {
		// Defined in extension Classes
	}
}