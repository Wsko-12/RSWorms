import DEV from '../../../../../../../server/DEV';
import {
    ESocketLobbyMessages,
    ISocketRoomsTableData,
    ISocketRoomsTableDataItem,
} from '../../../../../../../ts/socketInterfaces';
import PageBuilder from '../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../utils/PageElement';
import ClientSocket from '../../../../../clientSocket/ClientSocket';
import './style.scss';

export default class RoomsTable extends PageElement {
    protected element: HTMLDivElement;
    private isReady = false;
    constructor() {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms__table',
        });

        this.applyListeners();
    }

    private applyListeners() {
        return;
    }

    private update(rooms: ISocketRoomsTableDataItem[]) {
        console.log(rooms);
    }

    public init() {
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
}
