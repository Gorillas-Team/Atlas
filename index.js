const AtlasClient = require("./src/AtlasClient");
const config = require("./config");

console.log(config)

const Atlas = new AtlasClient({
    token: process.env.TOKEN,
    owners: config.owners,
    prefixes: config.prefixes,
    environment: config.prod ? "prod" : "dev",
    presence: {
        activity: {
            name: config.presence.activity.name || "",
            type: config.presence.activity.type || ""
        }
    }
});

Atlas.start();