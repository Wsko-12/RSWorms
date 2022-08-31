import { IStartGameOptions } from '../../ts/interfaces';
import ClientSocket from './clientSocket/ClientSocket';
import GameManager from './game/GameManager';
import Lobby from './lobby/lobby2/Lobby2';
import SoundManager from './soundManager/SoundManager';
export default class App {
    private game: GameManager | null = null;
    private soundManager: SoundManager | null = null;
    private lobby: Lobby | null = null;

    public start() {
        ClientSocket.init();
        this.soundManager = new SoundManager();
        setTimeout(() => {
            this.lobby = new Lobby(this.startGame);
            this.lobby.start();
        }, 1000);
    }

    private startGame(options: IStartGameOptions) {
        this.game = new GameManager(options);
    }
}
