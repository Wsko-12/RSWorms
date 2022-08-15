import { IGMLoops, IStartGameOptions } from '../../../ts/interfaces';
import AssetsManager from './assetsManager/AssetsManager';
import GameInterface from './gameInterface/GameInterface';
import Loop from './loop/Loop';
import World from './world/World';

export default class GameManager {
    private options: IStartGameOptions;
    private world: World;
    private loops: IGMLoops;
    private interface = new GameInterface();
    constructor(options: IStartGameOptions) {
        this.options = options;
        this.world = new World(options);
        this.loops = {
            paused: false,
            timestamp: Date.now(),
            all: {
                render: new Loop(60, (time) => {
                    this.interface.renderLoop(time);
                }),

                update: new Loop(30, (time) => {
                    this.interface.updateLoop(time);
                }),
            },
        };

        const mainScene = this.world.getMainScene();
        this.interface.setMainSceneToRenderer(mainScene);

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
