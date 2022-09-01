import {
    ESocketLobbyMessages,
    ISocketRoomsTableData,
    ISocketRoomsTableDataItem,
    ISocketRoomToggleData,
    TSocketListenerTuple,
} from '../../../../../../ts/socketInterfaces';
import DEV from '../../../../../DEV';
import RoomsManager from '../../../roomsManager/RoomsManager';
import UserManager from '../../../userManager/UserManager';
import CustomSocket from '../CustomSocket';

export default class RoomsSocketListeners {
    private static getRoomsTableRequestListener(socket: CustomSocket): TSocketListenerTuple {
        const message = ESocketLobbyMessages.roomsTableReq;
        const cb = () => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Request: ${message}`);
            }

            const response: ISocketRoomsTableData = {
                rooms: new RoomsManager().getRoomsData(),
            };

            socket.emit<ISocketRoomsTableData>(ESocketLobbyMessages.roomsTableUpdate, response);
        };

        return [message, cb];
    }

    private static getRoomToggleListener(socket: CustomSocket): TSocketListenerTuple {
        const message = ESocketLobbyMessages.roomToggle;
        const cb = (data: ISocketRoomToggleData) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Request: ${message}`, data);
            }
            const user = new UserManager().getUserByName(data.user);
            if (!user) {
                return;
            }

            const room = new RoomsManager().getRoomById(data.room);
            if (!room) {
                return;
            }

            if (data.status === 'join') {
                if (user.inRoom) {
                    return;
                }
                new RoomsManager().addUserToRoom(data.user, data.room);
            }

            if (data.status === 'leave') {
                if (user.inRoom === data.room) {
                    new RoomsManager().removeUserFromRoom(data.user, data.room);
                }
            }
        };
        return [message, cb];
    }

    private static getCreatingRoomRequestListener(socket: CustomSocket): TSocketListenerTuple {
        const message = ESocketLobbyMessages.roomCreateReq;
        const cb = (data: ISocketRoomsTableDataItem) => {
            new RoomsManager().createRoom(data);
        };
        return [message, cb];
    }

    public static applyListeners(socket: CustomSocket) {
        socket.on(...this.getRoomsTableRequestListener(socket));
        socket.on(...this.getCreatingRoomRequestListener(socket));
        socket.on(...this.getRoomToggleListener(socket));
    }
}
