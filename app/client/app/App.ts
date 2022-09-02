import { IStartGameOptions } from '../../ts/interfaces';
import PageBuilder from '../utils/PageBuilder';
import ClientMultiplayerSocket from './clientSocket/ClientMultiplayerSocket';
import ClientSocket from './clientSocket/ClientSocket';
import GameManager from './game/GameManager';
import Lobby from './lobby/lobby2/Lobby2';
import SoundManager from './soundManager/SoundManager';
export default class App {
    private static game: GameManager | null = null;
    private static soundManager: SoundManager | null = null;
    private static lobby: Lobby | null = null;

    public static start() {
        const element = PageBuilder.createElement('div', {
            classes: 'lobby__screen',
            content: 'Try to connect socket...',
        });
        document.body.append(element);
        let isSocketConnected: boolean;
        ClientSocket.init()
            .then(() => {
                ClientMultiplayerSocket.init();
                isSocketConnected = true;
            })
            .catch(() => {
                isSocketConnected = false;
                console.log("%c Socket isn't connected", 'color: red');
            })
            .finally(() => {
                document.body.innerHTML = '';
                this.soundManager = new SoundManager();

                this.lobby = new Lobby(isSocketConnected);
                this.lobby.start();
            });
    }

    public static startGame(options: IStartGameOptions) {
        document.body.innerHTML = '';
        this.game = new GameManager(options);
    }
}
