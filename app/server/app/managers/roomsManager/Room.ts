import { ESocketLobbyMessages, ISocketRoomReady, ISocketRoomsTableDataItem } from '../../../../ts/socketInterfaces';
import ManagerItem from '../ManagerItem';
import User from '../userManager/User';
import UserManager from '../userManager/UserManager';

export default class Room extends ManagerItem {
    public data: ISocketRoomsTableDataItem;
    public id: string;

    constructor(options: ISocketRoomsTableDataItem) {
        super();
        this.id = options.id;
        this.data = options;
        this.addUser(options.owner);
    }

    public getData(): ISocketRoomsTableDataItem {
        return { ...this.data };
    }

    public addUser(user: User | string) {
        let userInstance: User | null = null;
        if (typeof user === 'string') {
            userInstance = new UserManager().getUserByName(user) || null;
        }

        if (user instanceof User) {
            userInstance = user;
        }

        if (userInstance) {
            userInstance.setRoom(this.data.id);
            this.data.players.push(userInstance.name);
        }

        return this.data.players.length === this.data.teams;
    }

    public removeUser(user: string) {
        const index = this.data.players.indexOf(user);
        if (index != -1) {
            this.data.players.splice(index, 1);
            const userInstance = new UserManager().getUserByName(user) || null;
            if (userInstance) {
                if (userInstance.inRoom === this.data.id) {
                    userInstance.removeFromRoom(false);
                }
            }
        }
    }

    public ready() {
        const users = this.data.players.map((name) => new UserManager().getUserByName(name));
        users.forEach((user) => {
            const data: ISocketRoomReady = {
                id: this.id,
            };

            user?.emit(ESocketLobbyMessages.roomReady, data);
        });
    }

    public removeFromManager() {
        const players = [...this.data.players];
        players.forEach((player) => {
            this.removeUser(player);
        });
        super.removeFromManager();
    }
}
