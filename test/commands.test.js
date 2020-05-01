const { FileUtils } = require("../src/lib/utils/index");

const commands = [];

FileUtils.requireDir({ dir: "src/commands" }, (err, Command) =>{
	if(err) console.err(err);

	commands.push(Command);
});

describe("Commands", () => {
	it("should have no duplicate names or aliases", (done) => {
		const aliases = commands.reduce((arr, Command) => {
			const { name, aliases } = new Command();

			return [ ...arr, name, ...(aliases || [])];
		}, []);

		const dup = aliases.filter((value, index) => {
			return aliases.indexOf(value) !== index;
		});

		if(dup.length){
			done(new Error(`Names or aliases ware found more than once: ${dup.join(", ")}`));
		} else {
			done();
		}
	});
});