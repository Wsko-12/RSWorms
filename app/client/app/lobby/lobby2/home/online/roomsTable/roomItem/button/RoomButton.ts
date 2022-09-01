import PageBuilder from '../../../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../../../utils/PageElement';
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
}
