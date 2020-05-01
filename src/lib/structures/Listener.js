module.exports = class Listener {
	constructor(options = {}) {
		this.name = options.name || null;
		this.once = options.once || null;
	}

	listen(client) {
		try {
			const typeListen = this.once ? "once" : "on";
			client[typeListen](this.name, this.run);

			return true;
		} catch (ex) {
			console.error(ex);
			return false;
		}
	}

	run() { }
};