import PageBuilder from '../../../../../../utils/PageBuilder';
import './style.scss';
export default abstract class Button {
    protected element: HTMLDivElement;
    protected eventsHandler: HTMLElement;
    constructor(title: string, eventsHandler: HTMLElement) {
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'mobile-interface__button',
            content: title,
        });

        this.eventsHandler = eventsHandler;
    }
    public getElement() {
        return this.element;
    }
}
