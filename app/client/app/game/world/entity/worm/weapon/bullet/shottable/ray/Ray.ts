import { EWeapons } from '../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../ts/interfaces';
import ShottableBullet from '../Shottable';

export default class RayBullet extends ShottableBullet {
    constructor(options: IBulletOptions, textureName: EWeapons) {
        super(options, textureName);
        this.physics.g = 0;
        this.radius = 2;
    }
}
