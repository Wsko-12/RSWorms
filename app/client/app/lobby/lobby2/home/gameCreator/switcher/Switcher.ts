import PageBuilder from '../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../utils/PageElement';
import './style.scss';

export default abstract class Switcher extends PageElement {
    protected abstract value: number | string;
    protected element: HTMLDivElement;
    protected elements = {
        left: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'switcher__button lobby__button',
            content: '<',
        }),
        right: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'switcher__button lobby__button',
            content: '>',
        }),
        value: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'switcher__value',
            content: '',
        }),
    };

    constructor(title: string) {
        super();
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'switcher',
        });

        const titleElement = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'switcher__title',
            content: title,
        });

        this.element.append(titleElement);

        const container = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'switcher__container',
            content: [this.elements.left, this.elements.value, this.elements.right],
        });

        this.element.append(container);
        this.applyEvents();
    }

    protected abstract updateValue: (dir: 1 | -1 | 0) => void;

    protected applyEvents = () => {
        this.elements.left.addEventListener('click', () => {
            this.updateValue(-1);
        });

        this.elements.right.addEventListener('click', () => {
            this.updateValue(1);
        });
    };

    public getValue() {
        return this.value;
    }
}
