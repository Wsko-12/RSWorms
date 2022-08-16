import { IStartGameOptions } from '../../ts/interfaces';
import GameManager from './game/GameManager';
import Lobby from './lobby/Lobby';

export default class App {
    private game: GameManager | null = null;
    private lobby = new Lobby(this.startGame);
    public start() {
        this.lobby.start();
    }

    private startGame(options: IStartGameOptions) {
        this.game = new GameManager(options);
    }
}
