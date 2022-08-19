import Worm from '../../world/entity/Worm';

export default class WormManager {
    private controlledWorm: Worm | null = null;
    private jumpButtonTimestamp = 0;
    private jumpButtonDelayMS = 200;
    private timer = 0;

    public setWorm(worm: Worm) {
        this.controlledWorm = worm;
    }

    public getWorm() {
        return this.controlledWorm;
    }

    public handleEvent(e: KeyboardEvent) {
        if (!this.controlledWorm) {
            return;
        }

        if (e.type === 'keydown') {
            this.handleKeyDown(e);
        }
        if (e.type === 'keyup') {
            this.handleKeyUp(e);
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (!this.controlledWorm) {
            return;
        }
        const worm = this.controlledWorm;

        if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
            if (e.code === 'ArrowLeft') {
                worm.setMoveFlags({ left: true });
            }
            if (e.code === 'ArrowRight') {
                worm.setMoveFlags({ right: true });
            }
        }

        const jumpTimeout = () => {
            const t = setTimeout(() => {
                worm.jump();
            }, this.jumpButtonDelayMS + 1);
            return Number(t);
        };

        if (e.code === 'Space') {
            const now = Date.now();
            const delta = now - this.jumpButtonTimestamp;
            this.jumpButtonTimestamp = now;
            if (delta > this.jumpButtonDelayMS) {
                this.timer = jumpTimeout();
            } else {
                clearTimeout(this.timer);
                worm.jump(true);
            }
        }
    }

    private handleKeyUp(e: KeyboardEvent) {
        if (!this.controlledWorm) {
            return;
        }
        const worm = this.controlledWorm;

        if (e.code === 'ArrowLeft') {
            worm.setMoveFlags({ left: false });
        }
        if (e.code === 'ArrowRight') {
            worm.setMoveFlags({ right: false });
        }
    }

    //public shoot(){}
}
