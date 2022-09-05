import { EBullets, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import ParabolicBullet from '../Parabolic';

export default class BBazooka extends ParabolicBullet {
    public type: EBullets;
    constructor(options: IBulletOptions) {
        options.power *= 1.3;
        super(options, EWeapons.bazooka);
        this.setExplosionOptions(50, 200, 15);
        this.windCoefficient = 0.7;
        this.type = EBullets.BBazooka;
    }

    public betweenTurnsActions(): Promise<boolean> {
        this.remove();
        return Promise.resolve(true);
    }
}
