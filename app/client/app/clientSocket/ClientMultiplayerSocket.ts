import DEV from '../../../server/DEV';
import { ESocketGameMessages, ISocketLoadingMultiplayerGameData } from '../../../ts/socketInterfaces';
import App from '../App';
import Multiplayer from '../multiplayer/Multiplayer';
import ClientSocket from './ClientSocket';

export default class ClientMultiplayerSocket {
    public static init() {
        ClientSocket.on<ISocketLoadingMultiplayerGameData>(ESocketGameMessages.startLoading, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.startLoading}`, data);
            }
            if (data) {
                App.startGame(data);
            }
        });

        ClientSocket.on(ESocketGameMessages.allPlayersLoaded, () => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.allPlayersLoaded}`);
            }
            Multiplayer.showWaitingPlayersScreen(false);
        });
    }
}
