import { Server } from 'socket.io';
import { TRemoveFromSocketManagerCb } from '../../../ts/types';
import CustomSocket from '../customSocket/CustomSocket';
import * as http from 'http';

export default class SocketsManager {
    private sockets: CustomSocket[] = [];
    private socketServer: Server;

    constructor(server: http.Server) {
        this.socketServer = new Server(server);
        this.applyListeners();
    }
    private applyListeners() {
        this.socketServer.on('connection', (socket) => {
            const customSocket = new CustomSocket(socket);
            this.addSocket(customSocket);
        });
    }

    private addSocket(socket: CustomSocket) {
        socket.setRemoveFromSocketManagerCb(this.removeSocket);
        this.sockets.push(socket);
    }

    private removeSocket: TRemoveFromSocketManagerCb = (socket: CustomSocket) => {
        const index = this.sockets.indexOf(socket);
        if (index != -1) {
            this.sockets.splice(index, 1);
        }
    };
}
