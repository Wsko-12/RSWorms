import { EWeapons } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import SoundManager from '../../soundManager/SoundManager';
import Worm from '../../world/entity/worm/Worm';

export default class WormManager {
    private controlledWorm: Worm | null = null;
    private jumpButtonTimestamp = 0;
    private jumpButtonDelayMS = 200;
    private timer = 0;
    private aim: -1 | 0 | 1 = 0;
    private shooting = false;
    private readonly aimSpeed = 2;

    public setWorm(worm: Worm) {
        if (this.controlledWorm) {
            this.controlledWorm.setAsSelected(false);
        }
        this.controlledWorm = worm;
        worm.setAsSelected(true);
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
                SoundManager.playWorm('walk');
            }
            if (e.code === 'ArrowRight') {
                worm.setMoveFlags({ right: true });
                SoundManager.playWorm('walk');
            }
        }

        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            if (e.code === 'ArrowUp') {
                this.aim = 1;
            }
            if (e.code === 'ArrowDown') {
                this.aim = -1;
            }
        }

        if (e.code === 'Space') {
            this.shooting = true;
        }

        if (e.code === 'KeyJ') {
            this.controlledWorm.selectWeapon(EWeapons.bazooka);
        }

        const jumpTimeout = () => {
            const t = setTimeout(() => {
                worm.jump();
                SoundManager.playWorm('jump1');
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
                SoundManager.playWorm('jump2');
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

        if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
            if (e.code === 'ArrowUp' && this.aim > 0) {
                this.aim = 0;
            }
            if (e.code === 'ArrowDown' && this.aim < 0) {
                this.aim = 0;
            }
        }

        if (e.code === 'Space') {
            this.shooting = false;
            SoundManager.playWorm('shoot');
            return worm.shoot();
        }
    }

    public update: TLoopCallback = () => {
        const worm = this.controlledWorm;
        if (worm) {
            worm.changeAim(this.aim, this.aimSpeed, this.shooting);
        }
    };
}
