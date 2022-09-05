import { EBullets, ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    public type: EBullets;
    protected collisionSound = ESoundsBullet.dinamyte;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.dynamite);
        this.setExplosionOptions(50, 100, 15);
        this.type = EBullets.BDynamite;
    }
}
