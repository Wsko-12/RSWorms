import App from '../../App';
import LobbyHomePage from './home/LobbyHomePage';
import './style.scss';
export default class Lobby {
    private mainPage: LobbyHomePage;
    constructor(isSocketConnected: boolean) {
        this.mainPage = new LobbyHomePage(isSocketConnected);
    }

    public start() {
        App.screen.innerHTML = '';
        App.screen.append(this.mainPage.getElement());
    }
}
