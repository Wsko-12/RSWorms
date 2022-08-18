import { Vector2 } from '../../../utils/geometry';
import GameInterface from '../gameInterface/GameInterface';
import World from '../world/World';

export default class IOManager {
    private gameInterface: GameInterface;
    private world: World;

    constructor(gameInterface: GameInterface, world: World) {
        this.gameInterface = gameInterface;
        this.world = world;
        this.applyListeners();
    }

    applyListeners() {
        const entityManager = this.world.entityManager;
        let spaceTimestamp = 0;
        const spaceDelay = 200;

        let timer = 0;

        const jump = () => {
            const t = setTimeout(() => {
                entityManager.selectedWorm?.jump();
            }, spaceDelay + 1);
            return Number(t);
        };

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                const now = Date.now();
                const delta = now - spaceTimestamp;
                spaceTimestamp = now;
                if (delta > spaceDelay) {
                    timer = jump();
                } else {
                    console.log('double');
                    clearTimeout(timer);
                    entityManager.selectedWorm?.jump(true);
                }
            }
            if (e.code === 'ArrowLeft') {
                entityManager.selectedWorm?.setMoveFlags({ left: true });
            }
            if (e.code === 'ArrowRight') {
                entityManager.selectedWorm?.setMoveFlags({ right: true });
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') {
                entityManager.selectedWorm?.setMoveFlags({ left: false });
            }
            if (e.code === 'ArrowRight') {
                entityManager.selectedWorm?.setMoveFlags({ right: false });
            }
        });
    }
}
