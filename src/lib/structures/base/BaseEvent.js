module.exports = class BaseEvent {
    constructor(client) {
        this.client = client;
        this.name = null;
        this.once = false;
        this.type = "Discord";
        this.enable = true;
    }

    init() {
        if(this.enable) return this.run;
    }

    run() {
        // Defined in extension Classes
    }

    reload() {
        this.unload();
        this.client.events.set(this.name, this);
        return this.init();
    }

    unload() {
        this.client.events.delete(this.name);
        return this._unlisten();
    }

    disable() {
        this.enable = false;
        return this._unlisten();
    }

    enable() {
        this.enable = true;
        return this._listen();
    }

    _unlisten() {
        return this.client.removeAllListeners(this.name);
    }

    _listen() {
        return this.client[ this.once ? "once" : "on" ](this.name, this.run);
    }
}