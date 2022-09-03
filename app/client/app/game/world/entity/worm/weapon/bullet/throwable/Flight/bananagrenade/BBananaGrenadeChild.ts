import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import ParabolicBullet from '../../../shottable/parabolic/Parabolic';

export default class BBananasChild extends ParabolicBullet {
    protected windCoefficient = 0;
    constructor(options: IBulletOptions, name: EWeapons) {
        super(options, EWeapons.banana);
    }
}
