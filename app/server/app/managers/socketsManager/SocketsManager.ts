import Manager from '../Manager';
import CustomSocket from './customSocket/CustomSocket';
import * as http from 'http';
import { Server } from 'socket.io';

export default class SocketsManager extends Manager<CustomSocket> {
    protected static _instance: SocketsManager;
    private socketServer = new Server();
    protected managerType = 'SocketsManager';

    constructor(server?: http.Server) {
        super();
        if (SocketsManager._instance) {
            return SocketsManager._instance;
        }
        if (!server) {
            throw new Error(`[SocketsManager] init singletone first`);
        }

        this.socketServer = new Server(server);
        this.applyListeners();

        SocketsManager._instance = this;
    }

    private applyListeners() {
        this.socketServer.on('connection', (socket) => {
            const customSocket = new CustomSocket(socket);
            this.addItem(customSocket);
        });
    }
}
