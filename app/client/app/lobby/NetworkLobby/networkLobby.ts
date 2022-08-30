import PageBuilder from '../../../utils/PageBuilder';
import './style.scss';

export default function createNetworkLobbyPage(width: number, height: number) {
    const networkLobby = PageBuilder.createElement('div', { classes: 'network-lobby' });
    networkLobby.style.width = width + 'px';
    networkLobby.style.height = height + 'px';
    networkLobby.style.top = height * 2 + 'px';
    networkLobby.style.left = width * 0 + 'px';
    const returnBtn = PageBuilder.createElement('div', { classes: 'return-button' });
    returnBtn.style.backgroundImage = 'url(../../assets/lobby/return.png)';
    networkLobby.append(returnBtn);
    return networkLobby;
}
