import { ELang, ESoundsWeapon, ESoundsWormAction, ESoundsWormSpeech } from '../../../../../ts/enums';
import { EWeapons } from '../../../../../ts/enums';
import { TChooseWeaponCallback, TLoopCallback } from '../../../../../ts/types';
import SoundManager from '../../../soundManager/SoundManager';
import Worm from '../../world/entity/worm/Worm';

export default class WormManager {
    private controlledWorm: Worm | null = null;
    private jumpButtonTimestamp = 0;
    private jumpButtonDelayMS = 200;
    private timer = 0;
    private aim: -1 | 0 | 1 = 0;
    private shooting = false;
    private readonly aimSpeed = 2;
    private blockWeapon = false;

    public setWorm(worm: Worm | null) {
        this.blockWeapon = false;

        if (this.controlledWorm) {
            this.controlledWorm.setAsSelected(false);
        }
        this.controlledWorm = worm;
        if (worm) {
            worm.setAsSelected(true);
        }
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

        if (e.code === 'KeyG') {
            if (!this.blockWeapon) {
                this.controlledWorm.selectWeapon(EWeapons.grenade);
            }
        }
        if (e.code === 'KeyB') {
            if (!this.blockWeapon) {
                this.controlledWorm.selectWeapon(EWeapons.bazooka);
            }
        }
        if (e.code === 'KeyD') {
            if (!this.blockWeapon) {
                this.controlledWorm.selectWeapon(EWeapons.dynamite);
            }
        }
        if (e.code === 'KeyM') {
            if (!this.blockWeapon) {
                this.controlledWorm.selectWeapon(EWeapons.mine);
            }
        }
        if (e.code === 'KeyH') {
            if (!this.blockWeapon) {
                this.controlledWorm.selectWeapon(EWeapons.holygrenade);
            }
        }

        const jumpTimeout = () => {
            const t = setTimeout(() => {
                worm.jump();
            }, this.jumpButtonDelayMS + 1);
            return Number(t);
        };

        if (e.code === 'Enter') {
            if (e.repeat) {
                return;
            }
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

    public chooseWeapon: TChooseWeaponCallback = (weapon) => {
        if (!this.blockWeapon) {
            this.controlledWorm?.selectWeapon(weapon);
        }
    };

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
            // SoundManager.playWeapon(ESoundsWeapon.rocketRelease);

            const bullet = worm.shoot();
            if (bullet) {
                this.blockWeapon = true;
                worm.selectWeapon(null);
            }
            return bullet;
        }
    }

    public update: TLoopCallback = () => {
        const worm = this.controlledWorm;
        if (worm) {
            worm.changeAim(this.aim, this.aimSpeed, this.shooting);
        }
    };
}
