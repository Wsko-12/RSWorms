import { EBullets, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import ParabolicBullet from '../../../shottable/parabolic/Parabolic';

export default class BBananasChild extends ParabolicBullet {
    protected windCoefficient = 0;
    public type: EBullets;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.banana);
        this.type = EBullets.BBananasChild;
    }
}
