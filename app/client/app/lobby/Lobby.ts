/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../ts/enums';
import { TStartGameCallback } from '../../../ts/types';
import PageBuilder from '../../utils/pageBuilder';
import { IGMLoops, IStartGameOptions } from '../../../ts/interfaces';
import './style.scss';
import { Context } from 'vm';
import Loop from '../game/loop/Loop';

export default class Lobby {
    // private loops: IGMLoops;
    clouds: any[] = [];
    cloud: any;
    mainScreen: any;
    settings: any;
    customGameScreen: any;
    lobbyWrapper: any;
    canvasHeight = 0;
    canvasWidth = 0;
    windowHeight = 0;
    windowWidth = 0;
    ctx: Context | null = null;
    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;

        this.createLobby();
        this.createMainScreen();
        this.createCustomGameScreen();
        this.createSettings();
        this.mainScreen.scrollIntoView();
        this.createClouds();
        this.loop();

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyL') {
                this.mainScreen.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
            if (e.code === 'KeyC') {
                this.customGameScreen.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    }

    createSettings() {
        this.settings = PageBuilder.createElement('div', { classes: 'settings' });
        this.settings.style.width = this.windowWidth + 'px';
        this.settings.style.height = this.windowHeight + 'px';
        this.settings.style.top = this.windowHeight * 2 + 'px';
        this.settings.style.left = this.windowWidth * 2 + 'px';
        const returnBtn = PageBuilder.createElement('div', { classes: 'return-button' });
        returnBtn.innerText = 'return';
        returnBtn.addEventListener('click', () => {
            this.mainScreen.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
        this.settings.append(returnBtn);
        this.lobbyWrapper.append(this.settings);
    }

    createLobby() {
        this.lobbyWrapper = PageBuilder.createElement('div', { id: 'lobby-wrapper' });
        document.body.append(this.lobbyWrapper);
        this.windowHeight = document.documentElement.clientHeight;
        this.windowWidth = document.documentElement.clientWidth;
        // this.windowHeight = window.innerHeight;
        // this.windowWidth = window.innerWidth;
        this.canvasWidth = this.windowWidth * 3;
        this.canvasHeight = this.windowHeight * 3;
        this.lobbyWrapper.style.width = `${this.windowWidth * 3}px`;
        this.lobbyWrapper.style.height = `${this.windowHeight * 3}px`;
        this.lobbyWrapper.innerHTML += `<canvas id='canvas-lobby' width='${this.canvasWidth}px' height='${this.canvasHeight}px'></canvas>`;
        const canvas = document.getElementById('canvas-lobby') as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');
    }

    createMainScreen() {
        this.mainScreen = PageBuilder.createElement('div', { classes: 'main-screen' });
        this.mainScreen.style.width = this.windowWidth + 'px';
        this.mainScreen.style.height = this.windowHeight + 'px';
        this.mainScreen.style.top = this.windowHeight + 'px';
        this.mainScreen.style.left = this.windowWidth + 'px';

        const quickGameBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        quickGameBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/worms-single.jpeg)';
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
        const settingBtn = PageBuilder.createElement('div', { classes: 'main-screen-button' });
        settingBtn.style.backgroundImage = 'url(./assets/lobby/main-screen/wormssettings.jpeg)';
        settingBtn.addEventListener('click', () => {
            this.settings.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        const title = PageBuilder.createElement('div', { classes: 'main-screen-title' });


        this.mainScreen.append(quickGameBtn, customGameBtn, networkGameBtn, settingBtn, title);

        this.lobbyWrapper.append(this.mainScreen);
    }

    createCustomGameScreen() {
        this.customGameScreen = PageBuilder.createElement('div', { classes: 'custom-game-screen' });
        this.customGameScreen.style.width = this.windowWidth + 'px';
        this.customGameScreen.style.height = this.windowHeight + 'px';
        this.customGameScreen.style.top = '0px';
        this.customGameScreen.style.left = this.windowWidth * 2 + 'px';

        const quickGameBtn = PageBuilder.createElement('div', { classes: 'custom-game-screen-button' });
        const customGameBtn = PageBuilder.createElement('div', { classes: 'custom-game-screen-button' });
        const networkGameBtn = PageBuilder.createElement('div', { classes: 'custom-game-screen-button' });
        const settingBtn = PageBuilder.createElement('div', { classes: 'custom-game-screen-button' });
        const returnBtn = PageBuilder.createElement('div', { classes: 'return-button' });
        returnBtn.innerText = 'return';
        returnBtn.addEventListener('click', () => {
            this.mainScreen.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
        this.customGameScreen.append(quickGameBtn, customGameBtn, networkGameBtn, settingBtn, returnBtn);

        this.lobbyWrapper.append(this.customGameScreen);
    }

    private loop = () => {
        requestAnimationFrame(this.drawClouds.bind(this));
        setTimeout(this.loop, 40);
    };

    public start() {}

    createClouds() {
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

    drawClouds() {
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

    private startGame(options: IStartGameOptions) {
        document.body.innerHTML = '';
        this.startGameCallback(options);
    }
}
