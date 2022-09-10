import DEV from '../../../../../../../server/DEV';
import {
    ESocketLobbyMessages,
    ISocketRoomReady,
    ISocketRoomsTableData,
    ISocketRoomsTableDataItem,
} from '../../../../../../../ts/socketInterfaces';
import PageBuilder from '../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../utils/PageElement';
import ClientSocket from '../../../../../clientSocket/ClientSocket';
import MultiplayerInterface from '../../../../multiplayerInterface/MultiplayerInterface';
import User from '../../../../../User';
import RoomItem from './roomItem/RoomItem';
import './style.scss';

export default class RoomsTable extends PageElement {
    protected element: HTMLDivElement;
    private isReady = false;
    private items: Record<string, RoomItem> = {};
    constructor() {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms__table',
        });
    }

    private applyListeners() {
        ClientSocket.on<ISocketRoomReady>(ESocketLobbyMessages.roomReady, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketLobbyMessages.roomReady}`, data);
            }

            if (data) {
                if (User.inRoom === data.id) {
                    MultiplayerInterface.showStartGameScreen(data.id);
                }
            }
        });

        ClientSocket.on<ISocketRoomsTableData>(ESocketLobbyMessages.roomsTableUpdate, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketLobbyMessages.roomsTableUpdate}`, data);
            }
            if (data) {
                this.update(data.rooms);
            }
        });
        ClientSocket.emit(ESocketLobbyMessages.roomsTableReq);
    }

    private updatePlayerRoom(rooms: ISocketRoomsTableDataItem[]) {
        let playerRoom: string | null = null;
        rooms.forEach((data) => {
            const member = data.players.includes(User.nickname);
            if (member) {
                playerRoom = data.id;
            }
        });

        User.setRoom(playerRoom);
    }

    private update(rooms: ISocketRoomsTableDataItem[]) {
        this.updatePlayerRoom(rooms);

        rooms.forEach((data) => {
            const roomItem = this.items[data.id];
            if (roomItem) {
                roomItem.update(data);
            } else {
                const room = new RoomItem(data);
                this.items[data.id] = room;
            }
        });

        for (const id in this.items) {
            const onServer = rooms.find((data) => data.id === id);
            if (!onServer) {
                this.items[id].remove();
                delete this.items[id];
            }
        }

        const btn = <HTMLButtonElement>document.querySelector('#createRoomBtn');
        if (btn) {
            btn.disabled = !!User.inRoom;
        }

        this.render();
    }

    public render() {
        this.element.innerHTML = '';
        Object.values(this.items).forEach((item) => {
            this.element.append(item.getElement());
        });
    }

    public init() {
        this.applyListeners();
    }
}
