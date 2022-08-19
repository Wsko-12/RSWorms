import { TLoopCallback } from '../../../../ts/types';
import GameInterface from '../gameInterface/GameInterface';
import World from '../world/World';
import WormManager from './wormManager/WormManager';

export default class IOManager {
    private gameInterface: GameInterface;
    private world: World;
    public wormManager = new WormManager();

    constructor(gameInterface: GameInterface, world: World) {
        this.gameInterface = gameInterface;
        this.world = world;
        this.applyListeners();
    }

    //Delete later. Used in GameManager.start()
    public DEV__CheckTestWorm() {
        const worm = this.world.entityManager.getWorm('test');
        if (worm) {
            this.wormManager.setWorm(worm);
        }
    }
    private applyListeners() {
        document.addEventListener('keydown', (e) => {
            // here will be check isPlayerTurn()

            /* if(e.code === 'shootKey'){
                const bullet = this.wormManager.shoot();
                this.world.mainScene.add(bullet.getObject3d)
                this.world.entityManager.addEntity(bullet)
                return;
            }
             */

            this.wormManager.handleEvent(e);
        });

        document.addEventListener('keyup', (e) => {
            // here will be check isPlayerTurn()
            this.wormManager.handleEvent(e);
        });
    }

    public update: TLoopCallback = () => {
        const selectedWorm = this.wormManager.getWorm();
        if (selectedWorm && selectedWorm.isMoves()) {
            const point = selectedWorm.getPositionPoint();
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
            this.gameInterface.getGameCamera().moveTo(point);
        }
    };
}
