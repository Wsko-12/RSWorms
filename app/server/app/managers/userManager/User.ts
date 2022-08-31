import ManagerItem from '../ManagerItem';
import CustomSocket from '../socketsManager/customSocket/CustomSocket';

export default class User extends ManagerItem {
    public name: string;
    private customSocket: CustomSocket;

    constructor(name: string, customSocket: CustomSocket) {
        super();
        this.name = name;
        this.customSocket = customSocket;
    }

    public rename(name: string) {
        this.name = name;
    }
}
