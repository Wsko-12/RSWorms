import ManagerItem from '../ManagerItem';
import Room from '../roomsManager/Room';
import RoomsManager from '../roomsManager/RoomsManager';
import CustomSocket from '../socketsManager/customSocket/CustomSocket';

export default class User extends ManagerItem {
    public name: string;
    private customSocket: CustomSocket;
    public inRoom: string | null = null;

    constructor(name: string, customSocket: CustomSocket) {
        super();
        this.name = name;
        this.customSocket = customSocket;
    }

    public rename(name: string) {
        this.name = name;
    }

    public setRoom(room: string) {
        this.inRoom = room;
    }

    public removeFromRoom(selfRemove: boolean) {
        if (this.inRoom) {
            if (selfRemove) {
                new RoomsManager().removeUserFromRoom(this.name, this.inRoom);
            }
            this.inRoom = null;
        }
    }

    public removeFromManager(): void {
        this.removeFromRoom(true);
        super.removeFromManager();
    }
}
