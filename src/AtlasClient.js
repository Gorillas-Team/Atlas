const { Client, Collection } = require("discord.js");

module.exports = class AtlasClient extends Client {
    constructor(options = {}) {
        super(options);
        this.token = options.token;
        this.config = {
            owners: options.owners instanceof Array ? options.owners : [options.owners],
            prefixes: options.prefixes instanceof Array ? options.prefixes : [options.prefixes],
            environment: options.environment,
            presence: options.presence
        }
        this.commands = new Collection();
    }

    start() {
        this.login(this.token);
        return this;
    }
}