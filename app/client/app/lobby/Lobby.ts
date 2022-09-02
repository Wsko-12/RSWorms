/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ELang,
    EMapPacksDecorItems,
    EMapPacksNames,
    ESoundsBG,
    ESoundsBullet,
    ESoundsFX,
    ESoundsWeapon,
    ESoundsWormSpeech,
    EWorldSizes,
} from '../../../ts/enums';
import { TStartGameCallback } from '../../../ts/types';
import PageBuilder from '../../utils/PageBuilder';
import './style.scss';
import { Context } from 'vm';
import createSettingsPage from './Settings/settings';
import { getRandomMemberName, getRandomTeamName } from '../../utils/names';
import SoundManager from '../soundManager/SoundManager';
import NetworkLobby from './NetworkLobby/networkLobby';

export default class Lobby {
    clouds: any[] = [];
    cloud: any;
    mainScreen: any;
    settings: any;
    networkLobby: any;
    customGameScreen: any;
    lobbyWrapper: any;
    canvasHeight = 0;
    canvasWidth = 0;
    windowHeight = 0;
    windowWidth = 0;
    teamName = 'Developers';
    enemyTeamName = 'Bad Guys';
    memberNames: string[] = [];
    ctx: Context | null = null;
    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;
        this.loop();
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.mainScreen.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 1500);
        });
    }

    private createNetworkLobby() {
        this.networkLobby = new NetworkLobby(this.windowWidth, this.windowHeight);
        this.lobbyWrapper.append(this.networkLobby.getElement());
    }

    private createSettings() {
        this.settings = createSettingsPage(this.windowWidth, this.windowHeight);
        this.lobbyWrapper.append(this.settings);
    }

    private afterRender = () => {
        const teamRandomBtn = document.querySelector('#team-random-btn');
        teamRandomBtn?.addEventListener('click', (e) => {
            const input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
            input.value = getRandomTeamName();
        });
        const membersRandomBtns = document.querySelectorAll('#member-random-btn');
        membersRandomBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const input = (e.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement;
                input.value = getRandomMemberName();
            });
        });
        document.querySelector('.create')?.addEventListener('click', () => {
            this.memberNames = [];
            (document.querySelectorAll('.worm-name') as NodeListOf<HTMLInputElement>).forEach((worm) => {
                this.memberNames.push(worm.value);
            });
            this.teamName = (document.querySelector('.team-name-input') as HTMLInputElement).value;
            console.log(this.teamName, this.memberNames);
        });

        // soundtrack choosing

        const selectSingle = document.querySelector('.__select') as HTMLElement;
        const selectSingle_title = selectSingle?.querySelector('.__select__title') as HTMLElement;
        const selectSingle_labels = selectSingle?.querySelectorAll('.__select__label') || [];

        // Toggle menu
        selectSingle_title?.addEventListener('click', () => {
            if ('active' === selectSingle?.getAttribute('data-state')) {
                selectSingle.setAttribute('data-state', '');
            } else {
                selectSingle?.setAttribute('data-state', 'active');
            }
        });

        // Close when click to option
        for (let i = 0; i < selectSingle_labels.length; i++) {
            selectSingle_labels[i].addEventListener('click', (e) => {
                if (selectSingle_title && selectSingle && e.target)
                    selectSingle_title.textContent = (e.target as HTMLElement).textContent;
                selectSingle?.setAttribute('data-state', '');
            });
        }

        // Reset title
        const reset = document.querySelector('.reset') as HTMLElement;
        reset?.addEventListener('click', () => {
            if (selectSingle_title) selectSingle_title.textContent = selectSingle_title.getAttribute('data-default');
        });

        // end

        const soundBG = document.querySelector('#volume-bg');
        const soundSFX = document.querySelector('#volume-sfx');
        const soundWorm = document.querySelector('#volume-worm');
        soundBG?.addEventListener('change', (e) => {
            const volume = +(e.currentTarget as HTMLInputElement).value / 100;
            SoundManager.background.volume = volume;
            SoundManager.playBackground(ESoundsBG.outerspace);
            setTimeout(() => SoundManager.background.pause(), 1000);
        });
        soundSFX?.addEventListener('change', (e) => {
            const volume = +(e.currentTarget as HTMLInputElement).value / 100;
            SoundManager.sfx.volume = volume;
            SoundManager.bullet.volume = volume;
            SoundManager.weapon.volume = volume;
            SoundManager.worm.volume = volume;
            SoundManager.timer.volume = volume;
            SoundManager.playWeapon(ESoundsWeapon.holyGrenade);
        });
        soundWorm?.addEventListener('change', (e) => {
            const volume = +(e.currentTarget as HTMLInputElement).value / 100;
            SoundManager.wormSpeech.volume = volume;
            SoundManager.playWormSpeech(ELang.rus, ESoundsWormSpeech.youllRegret);
        });

        const returnBtns = document.querySelectorAll('.return-button');
        returnBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.mainScreen.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        });
    };

    private createLobby() {
        this.lobbyWrapper = PageBuilder.createElement('div', { id: 'lobby-wrapper' });
        document.body.append(this.lobbyWrapper);
        this.windowHeight = document.documentElement.clientHeight;
        this.windowWidth = document.documentElement.clientWidth;
        this.canvasWidth = this.windowWidth * 3;
        this.canvasHeight = this.windowHeight * 3;
        this.lobbyWrapper.style.width = `${this.windowWidth * 3}px`;
        this.lobbyWrapper.style.height = `${this.windowHeight * 3}px`;
        this.lobbyWrapper.innerHTML += `<canvas id='canvas-lobby' width='${this.canvasWidth}px' height='${this.canvasHeight}px'></canvas>`;
        const canvas = document.getElementById('canvas-lobby') as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');

        window.addEventListener('resize', this.resize);
    }

    private createMainScreen() {
        this.mainScreen = PageBuilder.createElement('div', { classes: 'main-screen' });
        this.mainScreen.style.width = this.windowWidth + 'px';
        this.mainScreen.style.height = this.windowHeight + 'px';
        this.mainScreen.style.top = this.windowHeight + 'px';
        this.mainScreen.style.left = this.windowWidth + 'px';

        const btnContainer = PageBuilder.createElement('div', { classes: 'main-screen-button-container' });

        const quickGameBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        quickGameBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/worms-single.jpeg)';
        quickGameBtn.addEventListener('click', this.startGame.bind(this));

        const customGameBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        customGameBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/worms-custom.jpeg)';
        customGameBtn.addEventListener('click', () => {
            this.customGameScreen.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
        const networkGameBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        networkGameBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/wormsnetwork.jpeg)';
        networkGameBtn.addEventListener('click', () => {
            this.networkLobby.getElement().scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        const settingBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        settingBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/wormssettings.jpeg)';
        settingBtn.addEventListener('click', () => {
            this.settings.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        const title = PageBuilder.createElement('div', { classes: 'main-screen-title' });

        btnContainer.append(quickGameBtn, customGameBtn, networkGameBtn, settingBtn, title);
        this.mainScreen.append(btnContainer);

        this.lobbyWrapper.append(this.mainScreen);
    }

    private createCustomGameScreen() {
        this.customGameScreen = PageBuilder.createElement('div', { classes: 'custom-game-screen' });
        this.customGameScreen.style.width = this.windowWidth + 'px';
        this.customGameScreen.style.height = this.windowHeight + 'px';
        this.customGameScreen.style.top = '0px';
        this.customGameScreen.style.left = this.windowWidth * 2 + 'px';
        const returnBtn = PageBuilder.createElement('div', { classes: 'return-button' });
        returnBtn.style.backgroundImage = 'url(../../assets/lobby/return.png)';
        this.customGameScreen.append(returnBtn);

        this.lobbyWrapper.append(this.customGameScreen);
    }

    private loop = () => {
        requestAnimationFrame(this.drawClouds.bind(this));
        setTimeout(this.loop, 40);
    };

    private startGame() {
        window.removeEventListener('resize', this.resize);
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
            texture: EMapPacksNames.moon,
            size: EWorldSizes.medium,
            seed,
            decor: {
                count: EMapPacksDecorItems[EMapPacksNames.moon],
                max: 6,
                min: 2,
            },
            worms: 6,
            multiplayer: false,
            teams: [
                {
                    name: this.teamName,
                    worms:
                        this.memberNames.length !== 0
                            ? this.memberNames
                            : new Array(6).fill(1).map((el) => getRandomMemberName()),
                    lang: ELang.rus,
                },
                {
                    name: getRandomTeamName(),
                    worms: new Array(6).fill(1).map((el) => getRandomMemberName()),
                    lang: ELang.eng,
                },
            ],
            hp: 100,
            time: 45,
            id: '',
        });
    }

    private createClouds() {
        if (this.clouds.length > 0) return;
        this.cloud = new Image();
        this.cloud.src = '../../assets/lobby/cloud.png';
        const cloudWidth = 300;
        const cloudHeight = 150;
        const quantity = Math.round(this.canvasHeight / cloudHeight);
        for (let i = 0; i < quantity; i++) {
            const y = cloudHeight * i;
            for (let i = 0; i <= 5; i++) {
                this.clouds.push({
                    x: Math.round(Math.random() * this.canvasWidth),
                    y: y,
                    width: cloudWidth,
                    height: cloudHeight,
                    deltaX: Math.round(Math.random()) ? 2 : -2,
                });
            }
        }
    }

    private drawClouds() {
        if (this.ctx) {
            this.ctx.fillStyle = '#7AD7FF';
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.clouds.forEach((el: any) => {
                if (this.ctx) {
                    el.x += el.deltaX;
                    if (el.x > this.canvasWidth || el.x < 0) el.deltaX = -el.deltaX;
                    this.ctx.drawImage(this.cloud, el.x, el.y, el.width, el.height);
                }
            });
        }
    }

    private resize = () => {
        document.body.innerHTML = '';
        this.start();
    };

    public start() {
        this.createLobby();
        this.createMainScreen();
        this.createCustomGameScreen();
        this.createSettings();
        this.createNetworkLobby();
        this.mainScreen.scrollIntoView();
        this.createClouds();
        this.afterRender();
    }
}
