import { IGameStartProps } from '../../ts/interfaces';
import GameManager from './game/GameManager';
import Lobby from './lobby/Lobby';

export default class App {
    game: GameManager | null = null;
    lobby = new Lobby(this.startGame);
    public start() {
        this.lobby.start();
    }

    private startGame(gameProps: IGameStartProps) {
        this.game = new GameManager(gameProps);
    }
}
