import { ELang, EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../../../ts/enums';
import { IStartGameOptions } from '../../../../../ts/interfaces';
import { getRandomMemberName, getRandomTeamName } from '../../../../utils/names';
import PageBuilder from '../../../../utils/PageBuilder';
import PageElement from '../../../../utils/PageElement';
import App from '../../../App';
import GameCreator from './gameCreator/GameCreator';
import LobbyOnlinePopUp from './online/LobbyOnlinePopUp';
import './style.scss';
export default class LobbyHomePage extends PageElement {
    protected element: HTMLElement;
    private onlinePopUp = new LobbyOnlinePopUp();

    private startCustomGame = (options: IStartGameOptions) => {
        console.log('Seed: ', options.seed);
        App.screen.innerHTML = '';
        App.startGame(options);
    };

    private gameCreator = new GameCreator(false, this.startCustomGame);
    private buttons: {
        play: HTMLButtonElement;
        custom: HTMLButtonElement;
        online: HTMLButtonElement;
    };

    constructor(isSocketConnected: boolean) {
        super();
        this.element = PageBuilder.createElement('section', {
            classes: 'lobby__screen home__overlay',
        });
        this.buttons = this.createButtons();

        this.buttons.online.disabled = !isSocketConnected;

        const buttonsContainer = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'home__buttons-container',
        });

        Object.values(this.buttons).forEach((button) => {
            buttonsContainer.append(button);
        });

        this.element.append(buttonsContainer);

        const online = this.onlinePopUp.getElement();
        this.element.append(online);

        const gameCreatorEl = this.gameCreator.getElement();
        this.element.append(gameCreatorEl);

        const footer = this.createFooter();
        this.element.append(footer);

        this.applyEvents();
    }

    private createFooter() {
        const element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__footer',
        });

        const logo = <HTMLLinkElement>PageBuilder.createElement('a', {
            classes: 'footer__logo',
            attrs: {
                target: '_blank',
                href: 'https://rs.school/js/',
            },
        });

        const year = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'footer__text',
            content: '2022',
        });

        const developers = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'footer__links',
            content: [<HTMLLinkElement>PageBuilder.createElement('a', {
                    classes: 'footer__text footer__developer',
                    attrs: {
                        target: '_blank',
                        href: 'https://github.com/Wsko-12',
                    },
                    content: 'Vlad Vasko',
                }), <HTMLLinkElement>PageBuilder.createElement('a', {
                    classes: 'footer__text footer__developer',
                    attrs: {
                        target: '_blank',
                        href: 'https://github.com/aleg3000',
                    },
                    content: 'Oleg Ganin',
                }), <HTMLLinkElement>PageBuilder.createElement('a', {
                    classes: 'footer__text footer__developer',
                    attrs: {
                        target: '_blank',
                        href: 'https://github.com/ivan-urban',
                    },
                    content: 'Ivan Urbanovich',
                })],
        });

        const container = <HTMLDivElement>PageBuilder.createElement('a', {
            classes: 'footer__container',
            content: [logo, year, developers],
        });

        element.append(container);
        return element;
    }

    private applyEvents() {
        this.buttons.play.addEventListener('click', () => {
            this.startFastGame();
        });

        this.buttons.online.addEventListener('click', () => {
            this.onlinePopUp.show(true);
        });

        this.buttons.custom.addEventListener('click', () => {
            this.gameCreator.show(true);
        });
    }

    private startFastGame() {
        App.screen.innerHTML = '';
        const seed = Math.random();
        // const seed = 0.7135371756374531;
        // const seed = 0.7972989657842342;
        // const seed = 0.7190317696597344;
        // const seed = 0.4884739715122959;

        //worms bug
        //const seed = 0.6469262503466888;
        // const seed = 0.711119400099296;
        // const seed = 0.4743319884630075;
        // const seed = 0.8253192090559442;
        // const seed = 0.2921779319246529;
        // const seed = 0.5464200270095712;
        // const seed = 0.11259509204096174;
        console.log('Seed: ', seed);
        App.startGame({
            texture: EMapPacksNames.moon,
            size: EWorldSizes.medium,
            seed,
            decor: {
                count: EMapPacksDecorItems[EMapPacksNames.moon],
                max: 6,
                min: 2,
            },
            worms: 4,
            multiplayer: false,
            teams: [
                {
                    name: getRandomTeamName(),
                    // worms:
                    //     this.memberNames.length !== 0
                    //         ? this.memberNames
                    //         : new Array(6).fill(1).map((el) => getRandomMemberName()),
                    worms: new Array(4).fill(1).map((el) => getRandomMemberName()),
                    lang: ELang.rus,
                },
                {
                    name: getRandomTeamName(),
                    worms: new Array(4).fill(1).map((el) => getRandomMemberName()),
                    lang: ELang.eng,
                },
            ],
            time: 45,
            hp: 100,
            id: '',
        });
    }

    private createButtons() {
        const play = <HTMLButtonElement>PageBuilder.createElement('button', {
            classes: 'lobby__button home__button',
            content: 'play',
        });

        const online = <HTMLButtonElement>PageBuilder.createElement('button', {
            classes: 'lobby__button home__button',
            content: 'online',
        });

        const custom = <HTMLButtonElement>PageBuilder.createElement('button', {
            classes: 'lobby__button home__button',
            content: 'custom',
        });
        return {
            play,
            custom,
            online,
        };
    }
}
