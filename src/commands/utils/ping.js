const Command = require("../../lib/structures/Command");

module.exports = class Ping extends Command {
	constructor(client){
		super(client);
		this.name = "ping";
		this.aliases = ["latencia"];
	}

	run({ channel }){
		channel.send(`Pong! 🏓 ${this.client.ws.ping}`);
	}
};