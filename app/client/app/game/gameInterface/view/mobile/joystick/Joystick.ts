import PageBuilder from '../../../../../../utils/PageBuilder';
import './style.scss';
export default class Joystick {
    private element: HTMLDivElement;
    private inner: HTMLDivElement;
    private eventsHandler: HTMLElement;
    constructor(eventsHandler: HTMLElement) {
        this.element = PageBuilder.createElement('div', {
            classes: 'joystick',
        });

        this.eventsHandler = eventsHandler;

        this.inner = PageBuilder.createElement('div', {
            classes: 'joystick__inner',
        });

        this.element.append(this.inner);
        this.applyEvents();
    }

    private applyEvents() {
        const field = this.element;
        const stick = this.inner;

        const emulateEvent = (x: number, y: number) => {
            if (x < -0.5) {
                const event = new KeyboardEvent('keydown', {
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                });

                document.dispatchEvent(event);
            } else if (x > 0.5) {
                const event = new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    code: 'ArrowRight',
                });

                document.dispatchEvent(event);
            } else {
                const eventR = new KeyboardEvent('keyup', {
                    key: 'ArrowRight',
                    code: 'ArrowRight',
                });

                const eventL = new KeyboardEvent('keyup', {
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                });

                document.dispatchEvent(eventR);
                document.dispatchEvent(eventL);
            }

            if (y > 0.8) {
                const event = new KeyboardEvent('keydown', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                });

                document.dispatchEvent(event);
            } else if (y < -0.8) {
                const event = new KeyboardEvent('keydown', {
                    key: 'ArrowUp',
                    code: 'ArrowUp',
                });

                document.dispatchEvent(event);
            } else {
                const eventU = new KeyboardEvent('keyup', {
                    key: 'ArrowUp',
                    code: 'ArrowUp',
                });

                const eventD = new KeyboardEvent('keyup', {
                    key: 'ArrowDown',
                    code: 'ArrowDown',
                });

                document.dispatchEvent(eventU);
                document.dispatchEvent(eventD);
            }
        };

        function calcPosition(e: TouchEvent) {
            e.preventDefault();
            const rect = field.getBoundingClientRect();

            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            const xDir = (x - rect.width / 2) / (rect.width / 2);
            const yDir = (y - rect.height / 2) / (rect.height / 2);

            stick.style.transform = `translate(${xDir * (rect.width / 2)}px, ${yDir * (rect.height / 2)}px)`;
            emulateEvent(xDir, yDir);
        }

        field.addEventListener('touchstart', calcPosition);

        field.addEventListener('touchmove', calcPosition);
        field.addEventListener('touchend', () => {
            stick.style.transform = '';
            emulateEvent(0, 0);
        });
    }

    public getElement() {
        return this.element;
    }
}
