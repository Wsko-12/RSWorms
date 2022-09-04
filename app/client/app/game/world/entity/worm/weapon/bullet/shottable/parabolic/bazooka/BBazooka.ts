import { EBullets, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import ParabolicBullet from '../Parabolic';

export default class BBazooka extends ParabolicBullet {
    public type: EBullets;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.bazooka);
        this.setExplosionOptions(70, 100, 10);
        this.type = EBullets.BBazooka;
    }

    public betweenTurnsActions(): Promise<boolean> {
        this.remove();
        return Promise.resolve(true);
    }
}
