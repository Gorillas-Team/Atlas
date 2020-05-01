const { Loader } = require("../lib/structures");
const { FileUtils } = require("../lib/utils");

module.exports = class ListenerLoader extends Loader {
	constructor (client) {
		super(client, "listeners");
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
		return FileUtils.requireDir({ dir: "src/listeners" }, (error, Listener) => {
			if (error) {
				this.logError("    Erro: " + error.stack);
				return this.failed++;
			}

			const listener = new Listener();
			listener.listen(this.client);

			console.info("|    [" + listener.name + "] carregado");
		});
	}
};
