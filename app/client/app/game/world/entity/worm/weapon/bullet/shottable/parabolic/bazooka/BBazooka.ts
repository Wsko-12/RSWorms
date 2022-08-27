import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import ParabolicBullet from '../Parabolic';

export default class BBazooka extends ParabolicBullet {
    constructor(options: IBulletOptions) {
        super(options, EWeapons.bazooka);
    }
}
