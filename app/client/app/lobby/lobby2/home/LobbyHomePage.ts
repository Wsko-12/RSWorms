import { ELang, EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../../../ts/enums';
import { IStartGameOptions } from '../../../../../ts/interfaces';
import { TStartGameCallback } from '../../../../../ts/types';
import { getRandomMemberName, getRandomTeamName } from '../../../../utils/names';
import PageBuilder from '../../../../utils/PageBuilder';
import PageElement from '../../../../utils/PageElement';
import GameCreator from './gameCreator/GameCreator';
import LobbyOnlinePopUp from './online/LobbyOnlinePopUp';
import './style.scss';
export default class LobbyHomePage extends PageElement {
    protected element: HTMLElement;
    private onlinePopUp = new LobbyOnlinePopUp();

    private startCustomGame = (options: IStartGameOptions) => {
        console.log('Seed: ', options.seed);
        document.body.innerHTML = '';
        this.startGameCallback(options);
    };

    private gameCreator = new GameCreator(false, this.startCustomGame);
    private buttons: {
        play: HTMLDivElement;
        custom: HTMLDivElement;
        online: HTMLDivElement;
    };

    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        super();
        this.startGameCallback = startGameCallback;
        this.element = PageBuilder.createElement('section', {
            classes: 'lobby__screen',
        });
        this.buttons = this.createButtons();

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

        this.applyEvents();
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
        document.body.innerHTML = '';
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
        this.startGameCallback({
            mapTexturePackName: EMapPacksNames.moon,
            worldSize: EWorldSizes.medium,
            seed,
            decor: {
                count: EMapPacksDecorItems[EMapPacksNames.moon],
                max: 6,
                min: 2,
            },
            wormsCount: 4,
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
        const play = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__button home__button',
            content: 'play',
        });

        const online = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__button home__button',
            content: 'online',
        });

        const custom = <HTMLDivElement>PageBuilder.createElement('div', {
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
