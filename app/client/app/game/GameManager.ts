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

        this.gameplayManager = new GameplayManager(options, this.world, this.IOManager, this.interface);
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
            },
        };

        const mainScene = this.world.getMainScene();
        this.interface.setMainSceneToRenderer(mainScene);
        const width = options.worldSize * EProportions.mapWidthToHeight;
        const height = options.worldSize;
        this.interface.setCameraBorders(0, 0, width, height);
        this.interface.setCameraMaxZoom(options.worldSize);

        this.start();
    }

    private async start() {
        await AssetsManager.init(this.options);
        await this.world.init();
        FallenItem.createTextures();
        this.gameplayManager.init(this.options);
        Object.values(this.loops.all).forEach((loop) => loop.switcher(true));
        this.interface.buildToDocument();
        this.world.create();
        SoundManager.playBackground(ESoundsBG.outerspace);
        this.loop();
        document.body.appendChild(stats.dom);
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
