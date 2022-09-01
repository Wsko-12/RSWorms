import {
    ESocketLobbyMessages,
    ISocketRoomsTableData,
    ISocketRoomsTableDataItem,
} from '../../../../ts/socketInterfaces';
import Manager from '../Manager';
import SocketsManager from '../socketsManager/SocketsManager';
import Room from './Room';

export default class RoomsManager extends Manager<Room> {
    protected static _instance: RoomsManager;
    protected managerType = 'RoomsManager';

    constructor() {
        super();
        if (RoomsManager._instance) {
            return RoomsManager._instance;
        }

        RoomsManager._instance = this;
    }

    public createRoom(options: ISocketRoomsTableDataItem) {
        const room = new Room(options);
        this.addItem(room);
        this.update();
    }

    public getRoomsData(): ISocketRoomsTableDataItem[] {
        const data = this.items.map((room) => room.getData());
        return data;
    }

    public addUserToRoom(userName: string, room: string) {
        const roomInstance = this.getRoomById(room);
        if (roomInstance) {
            roomInstance.addUser(userName);
        }
        this.update();
    }

    public removeUserFromRoom(userName: string, room: string) {
        const roomInstance = this.getRoomById(room);
        if (roomInstance) {
            if (roomInstance.data.owner === userName) {
                roomInstance.removeFromManager();
            } else {
                roomInstance.removeUser(userName);
            }
        }
        this.update();
    }

    public getRoomById(id: string) {
        return this.items.find((room) => room.id === id);
    }

    private update() {
        const response: ISocketRoomsTableData = {
            rooms: this.getRoomsData(),
        };

        new SocketsManager().sendAll<ISocketRoomsTableData>(ESocketLobbyMessages.roomsTableUpdate, response);
    }
}
