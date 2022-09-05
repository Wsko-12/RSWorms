import { Socket } from 'socket.io';
import DEV from '../../../../DEV';
import ManagerItem from '../../ManagerItem';
import User from '../../userManager/User';
import GamesSocketListeners from './listeners/GamesSocketListeners';
import LoginSocketListeners from './listeners/LoginSocketListeners';
import RoomsSocketListeners from './listeners/RoomsSocketListeners';

export default class CustomSocket extends ManagerItem {
    public socket: Socket;
    public user: User | null = null;

    constructor(socket: Socket) {
        super();
        this.socket = socket;
        this.applyListeners();
    }

    private applyListeners() {
        this.on('disconnect', () => {
            this.removeFromManager();
        });

        LoginSocketListeners.applyListeners(this);
        RoomsSocketListeners.applyListeners(this);
        GamesSocketListeners.applyListeners(this);
    }

    public emit<T>(msg: string, ...data: T[]) {
        if (DEV.showSocketResponseAndRequest) {
            console.log(`Response: ${msg}`, ...data);
        }
        this.socket.emit(msg, ...data);
    }

    public on<T>(msg: string, cb: (data?: T) => void) {
        this.socket.on(msg, cb);
    }

    public removeFromManager() {
        if (this.user) {
            this.user.removeFromManager();
        }
        super.removeFromManager();
    }

    public applyUser(user: User) {
        this.user = user;
    }

    public getId() {
        return this.socket.id;
    }
}
