import { IGameStartProps, IGMLoops } from '../../../ts/interfaces';
import GameInterface from './gameInterface/GameInterface';
import Loop from './loop/Loop';
import World from './world/World';

export default class GameManager {
    private props: IGameStartProps;
    private world = new World();
    private loops: IGMLoops;
    private interface = new GameInterface();
    constructor(gameProps: IGameStartProps) {
        this.props = gameProps;
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

        Object.values(this.loops.all).forEach((loop) => loop.switcher(true));
        this.interface.buildToDocument();
        this.world.createTestScene();
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
