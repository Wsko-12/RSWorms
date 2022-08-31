import { TStartGameCallback } from '../../../../ts/types';
import LobbyHomePage from './home/LobbyHomePage';
import './style.scss';
export default class Lobby {
    private startGameCallback: TStartGameCallback;
    private mainPage: LobbyHomePage;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;
        this.mainPage = new LobbyHomePage(startGameCallback);
    }

    public start() {
        document.body.innerHTML = '';
        document.body.append(this.mainPage.getElement());
    }
}
