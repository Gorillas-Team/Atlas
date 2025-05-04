import { LavalinkNode, LavalinkNodeOptions } from "./LavalinkNode";
import pino, { Logger } from "pino";
import { LavalinkPlayer } from "./LavalinkPlayer";

type LavalinkOptions = {
    clientId: string;
    logLevel: string;
    maxNodeReconnectAttempts?: number;
}

export class LavalinkClient {
    public logger: Logger;
    public clientId: string;
    private players: Map<string, LavalinkPlayer> = new Map();
    private nodes: Map<string, LavalinkNode> = new Map();

    constructor(options: LavalinkOptions, nodes: LavalinkNodeOptions[]) {
        this.logger = pino({
            level: options.logLevel,
            name: 'Lavalink-Client',
        })

        this.clientId = options.clientId;

        for (const nodeOptions of nodes) {
            this.addNode(nodeOptions);
        }
    }

    public addNode(options: LavalinkNodeOptions) {
        const node = new LavalinkNode(this, options);
        node.connect();
        this.nodes.set(node.name, node);
        return node;
    }
}
