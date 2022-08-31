import PageBuilder from '../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../utils/PageElement';
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

    public setReady(flag: boolean) {
        this.isReady = flag;
    }

    public fill() {
        if (!this.isReady) {
            return;
        }
    }
}
