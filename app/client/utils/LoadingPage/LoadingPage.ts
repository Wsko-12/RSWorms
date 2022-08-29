import PageBuilder from '../PageBuilder';
import './style.scss';

export default class LoadingPage {
    static prev: { done: () => void } | null = null;
    static start(title: string, max: number) {
        if (this.prev) {
            this.prev.done();
        }
        const elements = this.createElements(title);
        document.body.append(elements.element);
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

        return { element, bar };
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
