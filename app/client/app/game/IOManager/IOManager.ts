import { ECustomEvents } from '../../../../ts/enums';
import { TChooseWeaponCallback, TLoopCallback } from '../../../../ts/types';
import User from '../../User';
import GameInterface from '../gameInterface/GameInterface';
import MultiplayerGameplayManager from '../gameplayManager/MultiplayerGameplayManager';
import Bullet from '../world/entity/worm/weapon/bullet/Bullet';
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

    private applyListeners() {
        document.addEventListener('keydown', (e) => {
            if (MultiplayerGameplayManager.isOnline) {
                if (MultiplayerGameplayManager.getCurrentTurnPlayerName() != User.nickname) {
                    return;
                }
            }
            this.wormManager.handleEvent(e);

            if (e.code === 'KeyI') {
                this.gameInterface.showInventory(true);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (MultiplayerGameplayManager.isOnline) {
                if (MultiplayerGameplayManager.getCurrentTurnPlayerName() != User.nickname) {
                    return;
                }
            }
            const result = this.wormManager.handleEvent(e);
            if (result instanceof Bullet) {
                const scene = this.world.getMainScene();
                scene.add(result.getObject3D());
                this.world.entityManager.addEntity(result);
            }
        });

        this.gameInterface.getMainHandler().addEventListener(ECustomEvents.click, () => {
            this.gameInterface.showInventory(true);
        });

        this.gameInterface.inventoryElement.setChooseWeaponCallback(this.chooseWeapon);
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
