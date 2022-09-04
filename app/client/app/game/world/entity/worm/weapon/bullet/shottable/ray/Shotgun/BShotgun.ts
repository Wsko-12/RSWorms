import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import RayBullet from '../Ray';

export default class BShotgun extends RayBullet {
    constructor(options: IBulletOptions, name: EWeapons) {
        options.power = 100;
        super(options, EWeapons.bazooka);
        this.radius = 3;
        this.physics.g = 0;
        this.setExplosionOptions(40, 100, 12);
    }

    public betweenTurnsActions(): Promise<boolean> {
        this.remove();
        return Promise.resolve(true);
    }
}
