import { Vector2 } from '../../../utils/geometry';
import GameInterface from '../gameInterface/GameInterface';
import EntityManager from '../world/entity/EntityManager';
import World from '../world/World';

export default class IOManager {
    private gameInterface: GameInterface;
    private world: World;
    private entityManager: EntityManager;
    constructor(gameInterface: GameInterface, world: World) {
        this.gameInterface = gameInterface;
        this.world = world;
        this.entityManager = world.entityManager;

        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft') {
                if (this.entityManager.currentWorm.stable === 'stable') {
                    this.entityManager.currentWorm.push(new Vector2(-1, 0));
                }
            }
            if (e.code === 'ArrowRight') {
                if (this.entityManager.currentWorm.stable === 'stable') {
                    this.entityManager.currentWorm.push(new Vector2(1, 0));
                }
            }
            if (e.code === 'Space') {
                e.preventDefault();
                this.entityManager.currentWorm.push(new Vector2(3, 2));
                this.entityManager.currentWorm.stable = 'falling';
            }
            if (e.code === 'KeyB') {
                e.preventDefault();
                this.entityManager.currentWorm.push(new Vector2(-0.5, 4.5));
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                this.entityManager.currentWorm.push(new Vector2(0, 0));
            }
        });
    }
}
