import { IServerGameOptions } from '../../../../ts/interfaces';
import Manager from '../Manager';
import Room from '../roomsManager/Room';
import Game from './Game';

export default class GamesManager extends Manager<Game> {
    protected static _instance: GamesManager;

    protected managerType = 'GamesManager';

    constructor() {
        super();
        if (GamesManager._instance) {
            return GamesManager._instance;
        }

        GamesManager._instance = this;
    }

    public createGame(room: Room) {
        const game = new Game(room.data);
        this.addItem(game);
    }

    public getGameById(id: string) {
        return this.items.find((game) => game.id === id);
    }

    public removeUserFromGame(userName: string, game: string) {
        const gameInstance = this.getGameById(game);
        if (gameInstance) {
            gameInstance.removeUser(userName);
        }
    }
}
