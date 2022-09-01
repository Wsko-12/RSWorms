import ManagerItem from '../ManagerItem';
import Room from '../roomsManager/Room';
import CustomSocket from '../socketsManager/customSocket/CustomSocket';

export default class User extends ManagerItem {
    public name: string;
    private customSocket: CustomSocket;
    private inRoom: Room | null = null;

    constructor(name: string, customSocket: CustomSocket) {
        super();
        this.name = name;
        this.customSocket = customSocket;
    }

    public rename(name: string) {
        this.name = name;
    }

    public setRoom(room: Room) {
        this.inRoom = room;
    }
}
