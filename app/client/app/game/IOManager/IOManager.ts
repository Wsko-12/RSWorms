import { TLoopCallback } from '../../../../ts/types';
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
            if (entityManager.selectedWorm) {
                if (e.code === 'Space') {
                    const now = Date.now();
                    const delta = now - spaceTimestamp;
                    spaceTimestamp = now;
                    if (delta > spaceDelay) {
                        timer = jump();
                    } else {
                        clearTimeout(timer);
                        entityManager.selectedWorm?.jump(true);
                    }
                }

                if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
                    if (e.code === 'ArrowLeft') {
                        entityManager.selectedWorm.setMoveFlags({ left: true });
                    }
                    if (e.code === 'ArrowRight') {
                        entityManager.selectedWorm.setMoveFlags({ right: true });
                    }
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (entityManager.selectedWorm) {
                if (e.code === 'ArrowLeft') {
                    entityManager.selectedWorm?.setMoveFlags({ left: false });
                }
                if (e.code === 'ArrowRight') {
                    entityManager.selectedWorm?.setMoveFlags({ right: false });
                }
            }
        });
    }

    public update: TLoopCallback = () => {
        const selectedWorm = this.world.entityManager.selectedWorm;
        if (selectedWorm && selectedWorm.isMoves()) {
            const point = selectedWorm.getPositionPoint();
            point.x = Math.round(point.x);
            point.y = Math.round(point.y);
            this.gameInterface.getGameCamera().moveTo(point);
        }
    };
}
