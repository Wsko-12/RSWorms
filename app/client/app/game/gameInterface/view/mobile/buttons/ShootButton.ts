import Button from './Button';

export default class ShootButton extends Button {
    constructor(eventsHandler: HTMLElement) {
        super('Shoot', eventsHandler);
        this.applyEvents();
    }

    private applyEvents() {
        this.element.addEventListener('touchstart', () => {
            const event = new KeyboardEvent('keydown', {
                code: 'Space',
            });

            document.dispatchEvent(event);
        });

        this.element.addEventListener('touchend', () => {
            const event = new KeyboardEvent('keyup', {
                code: 'Space',
            });

            document.dispatchEvent(event);
        });
    }
}
