import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import RayBullet from '../Ray';

export default class BShotgun extends RayBullet {
    constructor(options: IBulletOptions) {
        super(options, EWeapons.bazooka);
        this.setExplosionOptions(25, 10, 5);
    }
}
