import App from '../../app/App';
import PageBuilder from '../PageBuilder';
import './style.scss';

export default class LoadingPage {
    static prev: { done: () => void } | null = null;
    static start(title: string, max: number) {
        if (this.prev) {
            this.prev.done();
        }
        const elements = this.createElements(title);
        App.screen.append(elements.element);
        elements.bar.style.width = '0%';

        const api = {
            setCurrent: (value: number) => {
                const { bar } = elements;
                bar.style.width = (value / max) * 100 + '%';
            },

            done: () => {
                elements.element.remove();
            },
        };

        this.prev = api;
        return api;
    }

    private static createElements(title: string) {
        const element = <HTMLDivElement>PageBuilder.createElement('div', {
            id: 'loading',
        });

        const overlay = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'loading__overlay',
        });

        element.append(overlay);

        const titleElement = <HTMLHeadingElement>PageBuilder.createElement('h4', {
            classes: 'loading__title',
            content: title,
        });

        const progressContainer = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'loading__progress-container',
        });

        const container = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'loading__container',
            content: [titleElement, progressContainer],
        });
        overlay.append(container);

        const bar = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'loading__progress',
        });
        progressContainer.append(bar);

        const tutorial = this.createTutorial();
        overlay.append(tutorial);

        return { element, bar };
    }

    private static createTutorial() {
        const element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'tutor__container',
        });

        const arrows = this.createTutorialLine('▴▾▸◂', '- Move worm');
        const jump = this.createTutorialLine('enter', '- Jump (x2 for backflip)');
        const shoot = this.createTutorialLine('space', '- Shoot (long press for shoot power)');
        const inventory = this.createTutorialLine('i or click', '- Inventory');
        const grenade = this.createTutorialLine('g', '- Grenade');
        const bazooka = this.createTutorialLine('b', '- Bazooka');
        const mine = this.createTutorialLine('m', '- Mine');
        const dynamite = this.createTutorialLine('d', '- Dynamite');
        const holyGrenade = this.createTutorialLine('h', '- Holy grenade');

        element.append(arrows, jump, shoot, inventory, grenade, bazooka, mine, dynamite, holyGrenade);
        return element;
    }

    private static createTutorialLine(button: string, text: string) {
        const element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'tutor__line',
        });

        const buttonElement = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'tutor__button',
            content: button,
        });

        const textElement = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'tutor__text',
            content: text,
        });

        element.append(buttonElement, textElement);

        return element;
    }

    // constructor() {
    //     if (LoadingPage._instance) return LoadingPage._instance;
    //     LoadingPage._instance = this;
    // }

    // start(max: number, autoClear = true): LoadingPage {
    //     this.clear();
    //     this._autoClear = autoClear;
    //     this._max = max;
    //     this._element = this.createElement();
    //     document.body.append(this._element);
    //     return this;
    // }
    // tick(currentValue: number) {
    //     if (currentValue >= this._max && this._autoClear) {
    //         this.clear();
    //         return;
    //     }
    //     const process = (currentValue / this._max) * 100;
    //     if (this._progressBar) {
    //         this._progressBar.style.width = process + '%';
    //     }
    // }

    // clear() {
    //     this._max = 0;
    //     this._element?.remove();
    // }
}
