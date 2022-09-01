import { io, Socket } from 'socket.io-client';
import DEV from '../../../server/DEV';
export default class ClientSocket {
    static handler: Socket | null = null;
    static init() {
        this.handler = io();
    }

    static emit<T>(msg: string, ...data: T[]) {
        if (DEV.showSocketResponseAndRequest) {
            console.log(`Request: ${msg} Data: `, ...data);
        }

        if (!this.handler) {
            return;
        }

        this.handler.emit(msg, ...data);
    }

    static on<T>(msg: string, cb: (data?: T) => void) {
        if (!this.handler) {
            return;
        }

        this.handler.on(msg, cb);
    }
}
