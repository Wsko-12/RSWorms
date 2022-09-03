import {
    ESocketGameMessages,
    ISocketDoneLoadingMultiplayerGame,
    TSocketListenerTuple,
} from '../../../../../../ts/socketInterfaces';
import DEV from '../../../../../DEV';
import GamesManager from '../../../gamesManager/GamesManager';
import CustomSocket from '../CustomSocket';

// ClientSocket.emit(ESocketGameMessages.loadingDone, data);
export default class GamesSocketListeners {
    private static getLoadingDoneListener(socket: CustomSocket): TSocketListenerTuple {
        const message = ESocketGameMessages.loadingDone;
        const cb = (data: ISocketDoneLoadingMultiplayerGame) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Request: ${message}`, data);
            }

            const game = new GamesManager().getGameById(data.game);
            if (game) {
                game.setPlayerLoadedState(data.user);
            }
        };

        return [message, cb];
    }

    public static applyListeners(socket: CustomSocket) {
        socket.on(...this.getLoadingDoneListener(socket));
    }
}
