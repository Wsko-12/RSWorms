import { Socket } from 'socket.io';

export default class User {
    public socket: Socket;
    constructor(socket: Socket) {
        this.socket = socket;

        this.applySocketListeners();
    }
    private applySocketListeners() {
        const { socket } = this;
    }
}
