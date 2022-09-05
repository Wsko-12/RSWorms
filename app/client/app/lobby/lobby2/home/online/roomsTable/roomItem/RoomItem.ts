import { EWorldSizes } from '../../../../../../../../ts/enums';
import { ISocketRoomsTableDataItem } from '../../../../../../../../ts/socketInterfaces';
import PageBuilder from '../../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../../utils/PageElement';
import User from '../../../../../../User';
import RoomButton from './button/RoomButton';
import PlayersColumn from './columns/PlayersColumn';
import './style.scss';

export default class RoomItem extends PageElement {
    public data: ISocketRoomsTableDataItem;
    protected element: HTMLElement;

    protected elements: {
        id: HTMLParagraphElement;
        players: PlayersColumn;
        button: RoomButton;
    };
    constructor(data: ISocketRoomsTableDataItem) {
        super();
        this.data = data;
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms-item',
        });

        const id = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'rooms-item__id',
            content: data.id,
        });

        const body = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms-item__body',
        });

        const players = new PlayersColumn(data.players, data.teams);
        const button = new RoomButton(data.id);

        this.elements = {
            id,
            players,
            button,
        };

        const time = this.createColumn('Time', data.time.toString());
        const worms = this.createColumn('Worms', data.worms.toString());
        const hp = this.createColumn('HP', data.hp.toString());
        const map = this.createColumn('Map', `${data.texture} <br> ${EWorldSizes[data.size]}`);

        body.append(players.getElement(), time, worms, hp, map);

        this.element.append(id, body, button.getElement());
        this.update(data);
    }

    private createColumn(title: string, text: string) {
        const column = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms-item__column',
            content: [
                PageBuilder.createElement('p', {
                    classes: 'rooms-item__column-title',
                    content: title,
                }),
                PageBuilder.createElement('p', {
                    classes: 'rooms-item__column-text',
                    content: text,
                }),
            ],
        });
        return column;
    }

    public update(data: ISocketRoomsTableDataItem) {
        this.element.style.order = User.inRoom === this.data.id ? '0' : '1';

        this.elements.players.updateList(data.players);
        this.elements.button.update();
        return;
    }

    public remove() {
        this.element.remove();
    }
}
