import PageBuilder from '../../../../../utils/PageBuilder';
import PageElement from '../../../../../utils/PageElement';
import './style.scss';

export default class GameMenu extends PageElement {
    protected element: HTMLElement;
    private openBtn: HTMLDivElement;
    private exit: HTMLDivElement;
    private fullscreen: HTMLDivElement;

    private overlay: HTMLDivElement;

    private isOpened = false;
    constructor() {
        super();
        this.element = PageBuilder.createElement('section', {
            classes: 'lobby__screen game-menu__section',
        });

        this.openBtn = PageBuilder.createElement('div', {
            classes: 'lobby__button game-menu__btn_open',
            content: 'Menu',
        });

        this.overlay = PageBuilder.createElement('section', {
            classes: 'lobby__screen game-menu__overlay',
        });

        this.element.append(this.openBtn, this.overlay);
        this.overlay.style.display = 'none';

        const menuContainer = PageBuilder.createElement('div', {
            classes: 'lobby__pop-up game-menu__container',
        });

        this.fullscreen = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__button game-menu__btn',
            content: 'Full screen',
        });

        this.exit = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__button game-menu__btn',
            content: 'Exit',
        });

        menuContainer.append(this.fullscreen, this.exit);

        this.overlay.append(menuContainer);
        this.applyEvents();
    }

    private applyEvents() {
        this.openBtn.addEventListener('click', () => {
            this.toggle();
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.toggle();
            }
        });

        this.fullscreen.addEventListener('click', () => {
            this.toggleFullScreen();
        });

        this.exit.addEventListener('click', () => {
            window.location.reload();
        });
    }

    private toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    public toggle() {
        if (this.isOpened) {
            this.openBtn.style.display = 'block';
            this.overlay.style.display = 'none';
            this.isOpened = false;
        } else {
            this.openBtn.style.display = 'none';
            this.overlay.style.display = 'flex';
            this.isOpened = true;
        }
    }
}
