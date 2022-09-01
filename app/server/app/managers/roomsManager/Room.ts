import { ISocketRoomsTableDataItem } from '../../../../ts/socketInterfaces';
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
            userInstance.setRoom(this);
            this.data.players.push(userInstance.name);
        }
    }
}
