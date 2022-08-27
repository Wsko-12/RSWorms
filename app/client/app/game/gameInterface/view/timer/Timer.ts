import './style.scss';

export default class TimerInterface {
    private element: HTMLDivElement;
    private timer: HTMLParagraphElement;
    constructor() {
        const element = document.createElement('div');
        element.classList.add('timer');
        this.element = element;

        const timer = document.createElement('p');
        timer.classList.add('timer__counter');
        this.element.append(timer);

        this.timer = timer;
    }

    public getElement() {
        return this.element;
    }

    public update = (ms: number) => {
        const value = Math.floor(ms / 1000);
        this.timer.innerHTML = value.toString();
    };

    public show = (flag: boolean) => {
        if (flag) {
            this.element.style.display = 'flex';
        } else {
            this.element.style.display = 'none';
        }
    };
}
