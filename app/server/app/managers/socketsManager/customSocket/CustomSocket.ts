import { Socket } from 'socket.io';
import {
    ESocketLogUserResStatuses,
    ESocketMessages,
    ISocketLogUserReq,
    ISocketLogUserRes,
} from '../../../../../ts/socketInterfaces';
import ManagerItem from '../../ManagerItem';
import User from '../../userManager/User';
import UserManager from '../../userManager/UserManager';

export default class CustomSocket extends ManagerItem {
    public socket: Socket;
    private user: User | null = null;

    constructor(socket: Socket) {
        super();
        this.socket = socket;
        this.applyListeners();
    }

    private applyListeners() {
        this.on('disconnect', () => {
            this.removeFromManager();
        });

        this.on<ISocketLogUserReq>(ESocketMessages.logUserReq, (data) => {
            if (data) {
                if (this.user) {
                    const response: ISocketLogUserRes = {
                        status: ESocketLogUserResStatuses.success,
                        rename: true,
                        name: data.nickname,
                    };
                    if (this.user.name === data.nickname) {
                        this.emit<ISocketLogUserRes>(ESocketMessages.logUserRes, response);
                        return;
                    }
                    const isTaken = new UserManager().hasUser(data.nickname);
                    if (isTaken) {
                        response.status = ESocketLogUserResStatuses.isTaken;
                        response.name = this.user.name;
                    } else {
                        this.user.rename(data.nickname);
                    }
                    this.emit<ISocketLogUserRes>(ESocketMessages.logUserRes, response);
                } else {
                    const user = new UserManager().createUser(data.nickname, this);
                    const response: ISocketLogUserRes = {
                        status: user ? ESocketLogUserResStatuses.success : ESocketLogUserResStatuses.isTaken,
                        rename: false,
                        name: user ? data.nickname : null,
                    };
                    this.user = user;
                    this.emit<ISocketLogUserRes>(ESocketMessages.logUserRes, response);
                }
            }
        });
    }

    public emit<T>(msg: string, ...data: T[]) {
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
}
