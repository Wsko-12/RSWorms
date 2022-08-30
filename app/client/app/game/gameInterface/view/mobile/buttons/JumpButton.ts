import Button from './Button';

export default class JumpButton extends Button {
    constructor(eventsHandler: HTMLElement) {
        super('Jump', eventsHandler);
        this.applyEvents();
    }

    private applyEvents() {
        this.element.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            const event = new KeyboardEvent('keydown', {
                code: 'Enter',
            });

            document.dispatchEvent(event);
        });

        this.element.addEventListener('touchend', (e) => {
            e.stopPropagation();
            const event = new KeyboardEvent('keyup', {
                code: 'Enter',
            });

            document.dispatchEvent(event);
        });
    }
}
