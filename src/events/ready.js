const { BaseEvent } = require("../lib/structures");

module.exports = class extends BaseEvent {
    constructor(client){
        super(client);
        this.once = true;
    }

    run() {
        console.log("Online on client", this.client.user.username);
    }
}