const { Loader } = require("../lib/structures");
const { FileUtils } = require("../lib/utils");

module.exports = class CommandLoader extends Loader {
	constructor (client) {
		super(client, "commands");
		this.critical = true;
	}

	load () {
		try {
			this.init();
			this.log(this.failed ? this.success + " carregaram com sucesso e " + this.failed + " falharam" : "Todos carregados com sucesso");
			return true;
		} catch (err) {
			this.logError(err.stack);
		}
		return false;
	}

	init () {
		this.log("Carregando...");
		return FileUtils.requireDir({ dir: "src/commands" }, (error, Command) => {
			if (error) {
				this.logError("    Erro: " + error.stack);
				return this.failed++;
			}

			const cmd = new Command(this.client);
			this.client.commands.set(cmd.name, cmd);
			console.info("|    [" + cmd.category + "] [" + cmd.name + "] carregado.");
			this.success++;
		});
	}
};
