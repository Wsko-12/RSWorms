import PageBuilder from '../../../../../utils/PageBuilder';
import './style.scss';

export default class WindInterface {
    private element: HTMLDivElement;
    private bars: {
        right: HTMLDivElement;
        left: HTMLDivElement;
    };
    constructor() {
        const leftBar = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: ['wind__bar', 'wind__bar-left'],
        });
        const leftContainer = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: ['wind__bar-container', 'wind__bar-container-left'],
            content: leftBar,
        });

        const rightBar = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: ['wind__bar', 'wind__bar-right'],
        });
        const rightContainer = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: ['wind__bar-container', 'wind__bar-container-right'],
            content: rightBar,
        });

        this.bars = {
            right: rightBar,
            left: leftBar,
        };

        const element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'wind',
            content: [leftContainer, rightContainer],
        });
        this.element = element;
    }

    public update = (value: number) => {
        const { left, right } = this.bars;
        const active = value > 0 ? right : left;
        const opposite = active === right ? left : right;

        active.style.width = `${Math.abs(value * 100)}%`;
        opposite.style.width = `0%`;
    };

    public getElement() {
        return this.element;
    }
}
