import PageBuilder from '../../../../../../utils/PageBuilder';
import PageElement from '../../../../../../utils/PageElement';
import './style.scss';

export default class NumberSwitcher extends PageElement {
    private value: number;
    protected element: HTMLDivElement;
    private options: {
        min: number;
        max: number;
        step: number;
    };
    private elements = {
        left: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'number-switcher__button lobby__button',
            content: '<',
        }),
        right: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'number-switcher__button lobby__button',
            content: '>',
        }),
        value: <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'number-switcher__value',
            content: '',
        }),
    };
    constructor(title: string, min: number, max: number, step: number, value?: number) {
        super();
        this.value = value || min;
        this.options = { min, max, step };
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'number-switcher',
        });

        const titleElement = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'number-switcher__title',
            content: title,
        });

        this.elements.value.innerHTML = this.value.toString();

        this.element.append(titleElement);

        const container = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'number-switcher__container',
            content: [this.elements.left, this.elements.value, this.elements.right],
        });

        this.element.append(container);
        this.updateValue(0);

        this.applyEvents();
    }

    private updateValue(dir: 1 | -1 | 0) {
        this.elements.left.classList.remove('number-switcher__button_disabled');
        this.elements.right.classList.remove('number-switcher__button_disabled');
        if (dir) {
            this.value += this.options.step * dir;
        }

        if (this.value <= this.options.min) {
            this.value = this.options.min;
            this.elements.left.classList.add('number-switcher__button_disabled');
        }

        if (this.value >= this.options.max) {
            this.value = this.options.max;
            this.elements.right.classList.add('number-switcher__button_disabled');
        }

        this.elements.value.innerHTML = this.value.toString();
    }

    private applyEvents() {
        this.elements.left.addEventListener('click', () => {
            this.updateValue(-1);
        });

        this.elements.right.addEventListener('click', () => {
            this.updateValue(1);
        });
    }
    public getValue() {
        return this.value;
    }
}
