import GamesManager from '../gamesManager/GamesManager';
import ManagerItem from '../ManagerItem';
import RoomsManager from '../roomsManager/RoomsManager';
import CustomSocket from '../socketsManager/customSocket/CustomSocket';

export default class User extends ManagerItem {
    public name: string;
    private customSocket: CustomSocket;
    public inRoom: string | null = null;
    public inGame: string | null = null;

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

    public setGame(game: string) {
        this.inGame = game;
    }

    public removeFromRoom(selfRemove: boolean) {
        if (this.inRoom) {
            if (selfRemove) {
                new RoomsManager().removeUserFromRoom(this.name, this.inRoom);
            }
            this.inRoom = null;
        }
    }

    public removeFromGame(selfRemove: boolean) {
        if (this.inGame) {
            if (selfRemove) {
                new GamesManager().removeUserFromGame(this.name, this.inGame);
            }
            this.inGame = null;
        }
    }

    public emit<T>(msg: string, ...data: T[]) {
        this.customSocket.emit(msg, ...data);
    }

    public removeFromManager(): void {
        this.removeFromRoom(true);
        this.removeFromGame(true);
        super.removeFromManager();
    }
}
