const AtlasClient = require("./src/AtlasClient");
const { owners, prefixes, presence, environment, token } = require("./config");

const Atlas = new AtlasClient({
	presence: {
		activity: {
			name: presence.activity.name || "",
			type: presence.activity.type || ""
		}
	},
	token,
	owners,
	prefixes,
	environment,
});

Atlas.start();