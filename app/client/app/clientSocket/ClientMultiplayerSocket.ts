import DEV from '../../../server/DEV';
import { ESocketGameMessages, ILoadingMultiplayerGameData } from '../../../ts/socketInterfaces';
import App from '../App';
import ClientSocket from './ClientSocket';

export default class ClientMultiplayerSocket {
    public static init() {
        ClientSocket.on<ILoadingMultiplayerGameData>(ESocketGameMessages.startLoading, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.startLoading}`, data);
            }
            if (data) {
                App.startGame(data);
            }
        });
    }
}
