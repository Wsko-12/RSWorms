import { IStartGameOptions } from '../../ts/interfaces';
import GameManager from './game/GameManager';
import Lobby from './lobby/Lobby';
import SoundManager from './soundManager/SoundManager';

export default class App {
    private game: GameManager | null = null;
    private soundManager: SoundManager | null = null;
    private lobby = new Lobby(this.startGame);
    public start() {
        this.lobby.start();
        this.soundManager = new SoundManager();
    }

    private startGame(options: IStartGameOptions) {
        this.game = new GameManager(options);
    }
}
