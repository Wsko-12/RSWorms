import { EProportions } from '../../../ts/enums';
import { IGMLoops, IStartGameOptions } from '../../../ts/interfaces';
import AssetsManager from './assetsManager/AssetsManager';
import GameInterface from './gameInterface/GameInterface';
import IOManager from './IOManager/IOManager';
import Loop from './loop/Loop';
import World from './world/World';

export default class GameManager {
    private options: IStartGameOptions;
    private world: World;
    private loops: IGMLoops;
    private interface = new GameInterface();
    private IOManager: IOManager;
    constructor(options: IStartGameOptions) {
        this.options = options;
        this.world = new World(options);
        this.IOManager = new IOManager(this.interface, this.world);
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
        Object.values(this.loops.all).forEach((loop) => loop.switcher(true));
        this.interface.buildToDocument();
        this.world.create();
        this.loop();
    }

    private loop = () => {
        const now = Date.now();
        const delta = (now - this.loops.timestamp) * 0.001;
        this.loops.timestamp = now;

        Object.values(this.loops.all).forEach((loop) => loop.play(delta));

        if (!this.loops.paused) {
            requestAnimationFrame(this.loop);
        }
    };
}
