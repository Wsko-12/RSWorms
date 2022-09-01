import {
    ESocketLogUserResStatuses,
    ESocketLobbyMessages,
    ISocketLogUserReq,
    ISocketLogUserRes,
    TSocketListenerTuple,
} from '../../../../../../ts/socketInterfaces';
import DEV from '../../../../../DEV';
import UserManager from '../../../userManager/UserManager';
import CustomSocket from '../CustomSocket';

export default class LoginSocketListeners {
    private static getLoginListener(socket: CustomSocket): TSocketListenerTuple {
        const message = ESocketLobbyMessages.logUserReq;
        const cb = (data: ISocketLogUserReq) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Request: ${message}`, data);
            }
            if (data) {
                if (socket.user) {
                    const response: ISocketLogUserRes = {
                        status: ESocketLogUserResStatuses.success,
                        rename: true,
                        name: data.nickname,
                    };
                    if (socket.user.name === data.nickname) {
                        socket.emit<ISocketLogUserRes>(ESocketLobbyMessages.logUserRes, response);
                        return;
                    }
                    const isTaken = new UserManager().hasUser(data.nickname);
                    if (isTaken) {
                        response.status = ESocketLogUserResStatuses.isTaken;
                        response.name = socket.user.name;
                    } else {
                        socket.user.rename(data.nickname);
                    }
                    socket.emit<ISocketLogUserRes>(ESocketLobbyMessages.logUserRes, response);
                } else {
                    const user = new UserManager().createUser(data.nickname, socket);
                    const response: ISocketLogUserRes = {
                        status: user ? ESocketLogUserResStatuses.success : ESocketLogUserResStatuses.isTaken,
                        rename: false,
                        name: user ? data.nickname : null,
                    };
                    socket.user = user;
                    socket.emit<ISocketLogUserRes>(ESocketLobbyMessages.logUserRes, response);
                }
            }
        };

        return [message, cb];
    }

    public static applyListeners(socket: CustomSocket) {
        socket.on(...this.getLoginListener(socket));
    }
}
