import { Socket } from 'socket.io';
import { TRemoveFromSocketManagerCb } from '../../../ts/types';

export default class CustomSocket {
    public socket: Socket;

    private removeFromSocketManagerCb: TRemoveFromSocketManagerCb | null = null;
    constructor(socket: Socket) {
        this.socket = socket;
        this.applyListeners();
    }

    private applyListeners() {
        this.socket.on('disconnect', this.remove);
    }

    public emit<T>(msg: string, ...data: T[]) {
        this.socket.emit(msg, data);
    }

    public remove = () => {
        if (this.removeFromSocketManagerCb) {
            this.removeFromSocketManagerCb(this);
            this.removeFromSocketManagerCb = null;
        }
    };

    public setRemoveFromSocketManagerCb(cb: TRemoveFromSocketManagerCb) {
        this.removeFromSocketManagerCb = cb;
    }
}
