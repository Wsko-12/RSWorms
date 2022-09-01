import {
    ESocketLobbyMessages,
    ISocketRoomsTableData,
    ISocketRoomsTableDataItem,
    TSocketListenerTuple,
} from '../../../../../../ts/socketInterfaces';
import DEV from '../../../../../DEV';
import RoomsManager from '../../../roomsManager/RoomsManager';
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
    }
}
