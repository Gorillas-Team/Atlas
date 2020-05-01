const { Client, Collection } = require("discord.js");
const Loaders = require("./loaders");

module.exports = class AtlasClient extends Client {
	constructor(options = {}) {
		super(options);
		this.token = options.token;
		this.config = {
			owners: options.owners instanceof Array ? options.owners : [options.owners],
			prefixes: options.prefixes instanceof Array ? options.prefixes : [options.prefixes],
			environment: options.environment,
			presence: options.presence
		};

		this.commands = new Collection();
	}

	initLoaders() {
		for(const Loader of Object.values(Loaders)) {
			try {
				const loader = new Loader(this);
				loader.init();
			} catch(ex) {
				throw new Error(ex);
			}
		}

		return this;
	}

	start() {
		this.initLoaders();
		this.login(this.token);
		return this;
	}
};