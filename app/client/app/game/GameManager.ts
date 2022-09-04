import { EProportions, ESoundsBG } from '../../../ts/enums';
import { IGMLoops, IStartGameOptions } from '../../../ts/interfaces';
import AssetsManager from './assetsManager/AssetsManager';
import GameInterface from './gameInterface/GameInterface';
import IOManager from './IOManager/IOManager';
import Loop from './loop/Loop';
import SoundManager from '../soundManager/SoundManager';
import GameplayManager from './gameplayManager/GameplayManager';
import World from './world/World';
import Stats from 'three/examples/jsm/libs/stats.module';
import FallenItem from './world/entity/fallenItem/FallenItem';
import MultiplayerGameplayManager from './gameplayManager/MultiplayerGameplayManager';
import App from '../App';
import ClientSocket from '../clientSocket/ClientSocket';
import { ESocketGameMessages, ISocketDoneLoadingMultiplayerGame } from '../../../ts/socketInterfaces';
import User from '../User';
import MultiplayerInterface from '../lobby/multiplayerInterface/MultiplayerInterface';
const stats = Stats();
export default class GameManager {
    private options: IStartGameOptions;
    private world: World;
    private loops: IGMLoops;
    private interface = new GameInterface();
    private gameplayManager: GameplayManager;
    private IOManager: IOManager;
    constructor(options: IStartGameOptions) {
        this.options = options;
        this.world = new World(options);
        this.IOManager = new IOManager(this.interface, this.world);

        this.gameplayManager = options.multiplayer
            ? new MultiplayerGameplayManager(options, this.world, this.IOManager, this.interface)
            : new GameplayManager(options, this.world, this.IOManager, this.interface);

        this.loops = {
            paused: false,
            timestamp: Date.now(),
            all: {
                render: new Loop(60, (time) => {
                    this.interface.renderLoop(time);
                }),

                update: new Loop(60, (time) => {
                    this.interface.updateLoop(time);
                    this.world.update(time);
                    this.IOManager.update(time);
                }),

                sprite: new Loop(25, (time) => {
                    this.world.spriteLoop(time);
                    FallenItem.spriteLoop();
                }),

                turnLoop: new Loop(2, () => {
                    this.gameplayManager.turnLoop();
                }),

                socketLoop: new Loop(10, () => {
                    if (this.gameplayManager instanceof MultiplayerGameplayManager) {
                        this.gameplayManager.socketLoop();
                    }
                }),
            },
        };

        const mainScene = this.world.getMainScene();
        this.interface.setMainSceneToRenderer(mainScene);
        const width = options.size * EProportions.mapWidthToHeight;
        const height = options.size;
        this.interface.setCameraBorders(0, 0, width, height);
        this.interface.setCameraMaxZoom(options.size);

        this.start();
    }

    private async start() {
        await AssetsManager.init(this.options);
        await this.world.init();
        FallenItem.createTextures();

        this.world.create();
        Object.values(this.loops.all).forEach((loop) => loop.switcher(true));
        this.interface.buildToDocument();
        SoundManager.playBackground(ESoundsBG.outerspace);
        this.gameplayManager.init(this.options);
        this.loop();
        if (this.options.multiplayer) {
            MultiplayerInterface.showWaitingPlayersScreen(true);
            const data: ISocketDoneLoadingMultiplayerGame = {
                game: this.options.id,
                user: User.nickname,
            };
            ClientSocket.emit(ESocketGameMessages.loadingDone, data);
        }
        App.screen.appendChild(stats.dom);
    }

    private loop = () => {
        stats.update();
        const now = Date.now();
        const delta = (now - this.loops.timestamp) * 0.001;
        this.loops.timestamp = now;

        Object.values(this.loops.all).forEach((loop) => loop.play(delta));

        if (!this.loops.paused) {
            requestAnimationFrame(this.loop);
        }
    };
}
