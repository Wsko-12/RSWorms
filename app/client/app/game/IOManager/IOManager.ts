import { ECustomEvents } from '../../../../ts/enums';
import { TChooseWeaponCallback, TLoopCallback } from '../../../../ts/types';
import GameInterface from '../gameInterface/GameInterface';
import Bullet from '../world/entity/worm/weapon/bullet/Bullet';
import World from '../world/World';
import WormManager from './wormManager/WormManager';

export default class IOManager {
    private gameInterface: GameInterface;
    private world: World;
    public wormManager = new WormManager();
    public weapons = ['bazooka', 'grenade', 'dynamite', 'mine'];

    constructor(gameInterface: GameInterface, world: World) {
        this.gameInterface = gameInterface;
        this.world = world;
        this.applyListeners();
    }

    private applyListeners() {
        document.addEventListener('keydown', (e) => {
            // here will be check isPlayerTurn()
            this.wormManager.handleEvent(e);

            if (e.code === 'KeyI') {
                this.gameInterface.renderArsenal(this.weapons);
            }
        });

        document.addEventListener('keyup', (e) => {
            // here will be check isPlayerTurn()
            const result = this.wormManager.handleEvent(e);
            if (result instanceof Bullet) {
                const scene = this.world.getMainScene();
                scene.add(result.getObject3D());
                this.world.entityManager.addEntity(result);
            }
        });

        this.gameInterface.getMainHandler().addEventListener('contextmenu', (e) => {
            this.gameInterface.renderArsenal(this.weapons);
        });

        this.gameInterface.arsenalElement.setChooseWeaponCallback(this.chooseWeapon);
    }

    private chooseWeapon: TChooseWeaponCallback = (weapon) => {
        this.wormManager.chooseWeapon(weapon);
    };

    public update: TLoopCallback = (time) => {
        this.wormManager.update(time);
        const selectedWorm = this.wormManager.getWorm();
        if (selectedWorm && selectedWorm.isMoves()) {
            const point = selectedWorm.getPositionPoint();
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
            this.gameInterface.getGameCamera().moveTo(point);
        }
    };
}
