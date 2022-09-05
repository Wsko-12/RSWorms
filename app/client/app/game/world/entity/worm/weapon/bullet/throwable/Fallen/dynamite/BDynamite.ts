import { EBullets, ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    public type: EBullets;
    protected collisionSound = ESoundsBullet.dinamyte;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.dynamite);
        this.setExplosionOptions(70, 250, 15);
        this.physics.friction = 0;
        this.type = EBullets.BDynamite;
    }
}
