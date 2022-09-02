import LobbyHomePage from './home/LobbyHomePage';
import './style.scss';
export default class Lobby {
    private mainPage: LobbyHomePage;
    constructor(isSocketConnected: boolean) {
        this.mainPage = new LobbyHomePage(isSocketConnected);
    }

    public start() {
        document.body.innerHTML = '';
        document.body.append(this.mainPage.getElement());
    }
}
