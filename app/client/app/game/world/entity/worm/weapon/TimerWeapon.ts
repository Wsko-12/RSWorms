import { IShootOptions } from '../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../ts/types';
import Weapon from './Weapon';

export default abstract class TimerWeapon extends Weapon {
    public timer = 5;
    constructor(textureName: string) {
        super(textureName);
        this.timer = 5;
    }

    public shoot(options: IShootOptions, removeEntityCallback: TRemoveEntityCallback) {
        options.timer = this.timer;
        const bullet = new this.bulletType(removeEntityCallback, Math.random().toString(), options);
        return bullet;
    }

    public changeTimer() {
        this.timer++;
        if (this.timer > 5) this.timer = 3;
    }
}
