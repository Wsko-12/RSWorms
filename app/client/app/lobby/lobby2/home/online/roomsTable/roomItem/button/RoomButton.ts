import { ESocketLobbyMessages, ISocketRoomToggleData } from '../../../../../../../../../ts/socketInterfaces';
import PageBuilder from '../../../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../../../utils/PageElement';
import ClientSocket from '../../../../../../../clientSocket/ClientSocket';
import User from '../../../../../../../User';

export default class RoomButton extends PageElement {
    protected element: HTMLButtonElement;
    private roomId: string;
    constructor(roomId: string) {
        super();
        this.element = <HTMLButtonElement>PageBuilder.createElement('button', {
            classes: 'lobby__button rooms-table__button',
        });

        this.roomId = roomId;
        this.update();
        this.applyListeners();
    }

    public update() {
        this.element.innerHTML = 'Join';
        this.element.disabled = true;

        if (User.inRoom === this.roomId) {
            this.element.innerHTML = 'Leave';
            this.element.disabled = false;
        }

        if (User.inRoom === null) {
            this.element.disabled = false;
        }
    }

    private applyListeners() {
        this.element.addEventListener('click', () => {
            if (User.inRoom && User.inRoom != this.roomId) {
                return;
            }

            if (!User.nickname) {
                return;
            }

            const request: ISocketRoomToggleData = {
                user: User.nickname,
                room: this.roomId,
                status: 'join',
            };

            if (User.inRoom && User.inRoom === this.roomId) {
                request.status = 'leave';
            }

            ClientSocket.emit(ESocketLobbyMessages.roomToggle, request);
        });
    }
}
