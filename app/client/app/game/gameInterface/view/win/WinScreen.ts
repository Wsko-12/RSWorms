import PageBuilder from '../../../../../utils/PageBuilder';
import PageElement from '../../../../../utils/PageElement';
import './style.scss';
export default class WinScreen extends PageElement {
    protected element: HTMLDivElement;
    protected title: HTMLParagraphElement;
    constructor() {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__screen win-screen__overlay',
        });

        this.title = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'win-screen__text',
            content: ``,
        });

        this.element.append(this.title);
        this.element.style.display = 'none';
    }

    show(teamName?: string) {
        this.element.style.display = 'flex';
        if (!teamName) {
            this.title.innerHTML = `It's a draw!`;
        } else {
            this.title.innerHTML = `${teamName} won!`;
        }
        return;
    }
}
