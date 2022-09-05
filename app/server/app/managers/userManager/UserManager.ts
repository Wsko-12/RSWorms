import Manager from '../Manager';
import CustomSocket from '../socketsManager/customSocket/CustomSocket';
import User from './User';

export default class UserManager extends Manager<User> {
    protected static _instance: UserManager;
    protected managerType = 'UserManager';
    constructor() {
        super();
        if (UserManager._instance) {
            return UserManager._instance;
        }

        UserManager._instance = this;
    }

    public createUser(name: string, customSocket: CustomSocket) {
        if (this.hasUser(name)) {
            return null;
        }

        const user = new User(name, customSocket);
        this.addItem(user);
        return user;
    }

    public hasUser(name: string) {
        const user = this.getUserByName(name);
        return !!user;
    }

    public getUserByName(name: string) {
        return this.items.find((user) => user.name === name);
    }
}
