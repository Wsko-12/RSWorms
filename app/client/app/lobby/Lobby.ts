import { EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../ts/enums';
import { TStartGameCallback } from '../../../ts/types';
import PageBuilder from '../../utils/pageBuilder';
import { IStartGameOptions } from '../../../ts/interfaces';
import './style.scss';

export default class Lobby {
    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;
    }
    public start() {
        this.buildLobby();
        // button.onclick = () => {
        // const seed = Math.random();
        // const seed = 0.7135371756374531;
        // const seed = 0.7972989657842342;
        // const seed = 0.7190317696597344;
        // const seed = 0.4884739715122959;

        //worms bug
        //const seed = 0.6469262503466888;

        // };
    }

    private buildLobby() {
        const title: HTMLElement = PageBuilder.createElement('div', {
            classes: 'title',
            content: 'WORMS',
        });

        const header: HTMLElement = PageBuilder.createElement('header', {
            classes: 'header',
            content: title,
        });

        const freeGameBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: ['free-game-btn', 'lobby-btn'],
            content: 'Start free game',
        });

        const seed = 0.711119400099296;
        console.log('Seed: ', seed);
        const defaultOptions = {
            mapTexturePackName: EMapPacksNames.candy,
            worldSize: EWorldSizes.medium,
            seed,
            decor: {
                count: EMapPacksDecorItems[EMapPacksNames.candy],
                max: 6,
                min: 2,
            },
        };

        freeGameBtn.addEventListener('click', () => {
            this.startGame(defaultOptions);
        });

        const customGameBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: ['custom-game-btn', 'lobby-btn'],
            content: 'Start custom game',
        });

        const customTitle: HTMLElement = PageBuilder.createElement('div', {
            classes: 'custom-title',
            content: 'Game Settings',
        });

        const optionMoon: HTMLOptionElement = PageBuilder.createElement<HTMLOptionElement>('option', {
            attrs: {
                value: 'moon',
                selected: true,
            },
            content: 'Moon',
        });

        const optionCandy: HTMLOptionElement = PageBuilder.createElement<HTMLOptionElement>('option', {
            attrs: {
                value: 'candy',
            },
            content: 'Candy',
        });

        const mapTextureSel: HTMLSelectElement = PageBuilder.createElement<HTMLSelectElement>('select', {
            classes: 'map-texture-sel',
            attrs: {
                name: 'mapTextureSel',
            },
            content: [optionMoon, optionCandy],
        });

        mapTextureSel.addEventListener('change', (e) => {
            const element = e.target as HTMLSelectElement;
            (
                document.querySelector('.texture-img') as HTMLImageElement
            ).src = `../../assets/mapPacks/${element.value}/ground.png`;
        });

        const mapTextureSelWrapper: HTMLElement = PageBuilder.createElement('div', {
            classes: 'map-texture-sel-wrapper',
            content: [
                mapTextureSel,
                `<img class='texture-img' width='50' height='50' src='../../assets/mapPacks/moon/ground.png'>`,
            ],
        });

        const mapSmall: HTMLInputElement = PageBuilder.createElement<HTMLInputElement>('input', {
            attrs: {
                type: 'radio',
                name: 'map-size',
                id: 'small',
                value: 'small',
            },
        });

        const mapMedium: HTMLInputElement = PageBuilder.createElement<HTMLInputElement>('input', {
            attrs: {
                type: 'radio',
                name: 'map-size',
                id: 'medium',
                value: 'medium',
                checked: true,
            },
        });

        const mapBig: HTMLInputElement = PageBuilder.createElement<HTMLInputElement>('input', {
            attrs: {
                type: 'radio',
                name: 'map-size',
                id: 'big',
                value: 'big',
            },
        });

        const mapSizeSelWrapper: HTMLElement = PageBuilder.createElement('div', {
            classes: 'map-size-sel-wrapper',
            content: [
                mapSmall,
                `<label for="small">Small</label>`,
                mapMedium,
                `<label for="medium">Medium</label>`,
                mapBig,
                `<label for="big">Big</label>`,
            ],
        });

        const startCustomGameBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: 'button',
            content: 'Start game',
        });

        const canselCustomGameBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: 'button',
            content: 'Cansel',
        });

        const customGameSet: HTMLElement = PageBuilder.createElement('div', {
            classes: 'custom-game-set',
            content: [
                customTitle,
                '<div>Map texture:</div>',
                mapTextureSelWrapper,
                `<div>Map size:</div>`,
                mapSizeSelWrapper,
                startCustomGameBtn,
                canselCustomGameBtn,
            ],
        });

        customGameBtn.addEventListener('click', () => {
            customGameSet.classList.add('open');
        });

        startCustomGameBtn.addEventListener('click', () => {
            this.startCustomGame();
        });

        canselCustomGameBtn.addEventListener('click', () => {
            customGameSet.classList.remove('open');
        });

        const settingsBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: ['settings-game-btn', 'lobby-btn'],
            content: 'Settings',
        });

        const nonameGameBtn: HTMLButtonElement = PageBuilder.createElement<HTMLButtonElement>('button', {
            classes: ['noname-game-btn', 'lobby-btn'],
            content: '?',
        });

        const btnsWrapper: HTMLElement = PageBuilder.createElement('div', {
            classes: 'btns-wrapper',
            content: [freeGameBtn, customGameBtn, settingsBtn, nonameGameBtn],
        });

        const main: HTMLElement = PageBuilder.createElement('main', {
            classes: 'main',
            content: btnsWrapper,
        });

        document.body.append(customGameSet, header, main);
    }

    private startCustomGame() {
        const seed = 0.711119400099296;
        const options: IStartGameOptions = {
            mapTexturePackName: EMapPacksNames.candy,
            worldSize: EWorldSizes.medium,
            seed,
            decor: {
                count: 13,
                max: 6,
                min: 2,
            },
        };

        const texture = (document.querySelector('.map-texture-sel') as HTMLSelectElement).value;
        options.mapTexturePackName = texture === 'moon' ? EMapPacksNames.moon : EMapPacksNames.candy;
        const mapSize: string = (document.querySelector(`input[name='map-size']:checked`) as HTMLInputElement).value;

        switch (mapSize) {
            case 'small':
                options.worldSize = EWorldSizes.small;
                break;
            case 'medium':
                options.worldSize = EWorldSizes.medium;
                break;
            case 'big':
                options.worldSize = EWorldSizes.big;
                break;
            default:
                options.worldSize = EWorldSizes.medium;
        }

        console.log(options);

        this.startGame(options);
    }

    private startGame(options: IStartGameOptions) {
        document.body.innerHTML = '';
        this.startGameCallback(options);
    }
}
