import {
    ESocketLogUserResStatuses,
    ESocketMessages,
    ISocketLogUserReq,
    ISocketLogUserRes,
} from '../../../../ts/socketInterfaces';
import PageBuilder from '../../../utils/PageBuilder';
import ClientSocket from '../../clientSocket/ClientSocket';
import './style.scss';
export default class NetworkLobby {
    private element: HTMLDivElement;
    private nickInput: HTMLInputElement;
    constructor(width: number, height: number) {
        const networkLobby = <HTMLDivElement>PageBuilder.createElement('div', { classes: 'network-lobby' });
        networkLobby.style.width = width + 'px';
        networkLobby.style.height = height + 'px';
        networkLobby.style.top = height * 2 + 'px';
        networkLobby.style.left = width * 0 + 'px';
        const returnBtn = <HTMLDivElement>PageBuilder.createElement('div', { classes: 'return-button' });
        returnBtn.style.backgroundImage = 'url(../../assets/lobby/return.png)';

        const input = <HTMLInputElement>PageBuilder.createElement('input', {
            attrs: {
                type: 'text',
                placeholder: 'Nickname',
            },
        });

        this.nickInput = input;
        networkLobby.append(returnBtn, input);
        this.element = networkLobby;
        this.applyListeners();
    }

    private applyListeners() {
        ClientSocket.on<ISocketLogUserRes>(ESocketMessages.logUserRes, (data) => {
            console.log(data);
            // if (data) {
            //     if(data.status === ESocketLogUserResStatuses.success){

            //     }
            // }
        });

        this.nickInput.addEventListener('change', (e) => {
            const data: ISocketLogUserReq = {
                nickname: this.nickInput.value,
            };

            ClientSocket.emit(ESocketMessages.logUserReq, data);
        });
    }

    public getElement() {
        return this.element;
    }
}
