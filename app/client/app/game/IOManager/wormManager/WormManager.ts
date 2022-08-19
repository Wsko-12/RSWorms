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
            return this.handleKeyDown(e);
        }
        if (e.type === 'keyup') {
            return this.handleKeyUp(e);
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

        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            let speed = 1;
            if (e.repeat) {
                speed = 2;
            }
            if (e.code === 'ArrowUp') {
                worm.changeAngle('up', speed);
            }
            if (e.code === 'ArrowDown') {
                worm.changeAngle('down', speed);
            }
        }

        if (e.code === 'Space') {
            worm.changePower();
        }

        const jumpTimeout = () => {
            const t = setTimeout(() => {
                worm.jump();
            }, this.jumpButtonDelayMS + 1);
            return Number(t);
        };

        if (e.code === 'Enter') {
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

        if (e.code === 'Space') {
            // добавить проверку выбрано ли оружие currentWeapon
            return worm.releaseBullet();
            // this.entityManager.createBullet(bullet);
        }
    }

    //public shoot(){}
}
