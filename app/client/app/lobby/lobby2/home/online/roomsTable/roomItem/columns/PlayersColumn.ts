import PageBuilder from '../../../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../../../utils/PageElement';
import User from '../../../../../../../User';

export default class PlayersColumn extends PageElement {
    protected element: HTMLElement;
    private list: HTMLUListElement;
    constructor(players: string[], max: number) {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'rooms-item__column',
        });

        this.list = <HTMLUListElement>PageBuilder.createElement('ul', {
            classes: 'rooms-item__list',
        });

        const title = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'rooms-item__column-title',
            content: `Players (${max})`,
        });

        this.updateList(players);

        this.element.append(title, this.list);
    }

    public updateList(players: string[]) {
        this.list.innerHTML = '';
        players.forEach((player) => {
            const li = <HTMLLIElement>PageBuilder.createElement('ul', {
                classes: player === User.nickname ? 'rooms-item__list-item_selected' : 'rooms-item__list-item',
                content: player,
            });
            this.list.append(li);
        });
    }
}
