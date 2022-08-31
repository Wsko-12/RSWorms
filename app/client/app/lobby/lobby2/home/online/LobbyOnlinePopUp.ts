import { IStartGameOptions } from '../../../../../../ts/interfaces';
import {
    ESocketLogUserResStatuses,
    ESocketMessages,
    ISocketLogUserReq,
    ISocketLogUserRes,
} from '../../../../../../ts/socketInterfaces';
import PageBuilder from '../../../../../utils/PageBuilder';
import PageElement from '../../../../../utils/PageElement';
import ClientSocket from '../../../../clientSocket/ClientSocket';
import GameCreator from '../gameCreator/GameCreator';
import RoomsTable from './roomsTable/RoomsTable';
import './style.scss';
export default class LobbyOnlinePopUp extends PageElement {
    protected element: HTMLDivElement;
    protected body: HTMLDivElement;
    private nick: HTMLInputElement;
    private nickMessage: HTMLParagraphElement;
    private roomsTable = new RoomsTable();
    private addRoomButton: HTMLDivElement;
    private gameCreator = new GameCreator(true, (options: IStartGameOptions) => {
        return;
    });

    constructor() {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__pop-up__overlay online__overlay',
        });

        const body = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__pop-up online',
        });

        this.body = body;

        this.nick = <HTMLInputElement>PageBuilder.createElement('input', {
            classes: 'online__input',
            attrs: {
                type: 'text',
                placeholder: 'nickname',
            },
        });

        this.nickMessage = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'online__message',
            content: 'Enter your nickname to play online',
        });

        this.addRoomButton = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__button rooms-table__button',
            content: 'create',
        });

        this.element.append(body);
        body.append(this.nick, this.nickMessage);
        this.show(false);
        this.applyListeners();
    }

    private applyListeners() {
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.show(false);
            }
        });

        this.addRoomButton.addEventListener('click', (e) => {
            this.gameCreator.show(true);
        });

        let oldName = '';
        let newName = '';
        ClientSocket.on<ISocketLogUserRes>(ESocketMessages.logUserRes, (data) => {
            if (!data) {
                return;
            }
            this.showInputMsg(true, data.status, newName.toUpperCase());
            if (data.status === ESocketLogUserResStatuses.success) {
                this.nick.style.color = '#7ee069';
                if (data.name) {
                    oldName = data.name;
                    this.nick.value = data.name;
                }
                this.fillTable();
            } else {
                this.nick.style.color = '#7ee069';
                if (data.name) {
                    oldName = data.name;
                    this.nick.value = data.name;
                } else {
                    this.nick.value = '';
                }
            }
        });

        this.nick.addEventListener('input', (e) => {
            newName = this.nick.value;
        });

        this.nick.addEventListener('change', (e) => {
            const validated = this.validateName(newName);
            if (validated) {
                const data: ISocketLogUserReq = {
                    nickname: validated,
                };

                ClientSocket.emit(ESocketMessages.logUserReq, data);
            } else {
                this.nick.value = oldName;
                this.showInputMsg(true, ESocketLogUserResStatuses.isIncorrect, newName);
            }
        });

        this.nick.addEventListener('input', (e) => {
            this.nick.style.color = 'black';
        });
    }

    private validateName(name: string): string | false {
        const string = name.toUpperCase().trim();
        if (/^[A-Z0-9]+$/.test(string)) {
            return string.length >= 3 ? string : false;
        } else {
            return false;
        }
    }

    private showInputMsg(flag: boolean, status?: ESocketLogUserResStatuses, name?: string) {
        this.nickMessage.style.color = '#af2222';
        if (!flag) {
            this.nickMessage.style.display = 'none';
        } else {
            this.nickMessage.style.display = 'block';

            if (status === ESocketLogUserResStatuses.success) {
                this.showInputMsg(false);
            }

            if (status === ESocketLogUserResStatuses.isTaken) {
                this.nickMessage.innerHTML = `${name} is already taken by another user`;
            }

            if (status === ESocketLogUserResStatuses.isIncorrect) {
                this.nickMessage.innerHTML = `${name} is incorrect name for game`;
            }
        }
    }

    private fillTable() {
        this.roomsTable.setReady(true);
        this.body.append(this.addRoomButton);
        this.body.append(this.roomsTable.getElement());
        this.body.append(this.gameCreator.getElement());
        this.roomsTable.fill();
    }

    public show(flag: boolean) {
        this.element.style.display = flag ? 'flex' : 'none';
        this.gameCreator.show(false);
    }
}
