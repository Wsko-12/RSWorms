import { EBullets, ESoundsBullet, ESoundsWeapon, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightBullet from '../Flight';

export default class BGrenade extends FlightBullet {
    public type: EBullets;
    protected shootSound = ESoundsWeapon.throwRelease;
    protected collisionSound = ESoundsBullet.grenadeCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.grenade);
        this.type = EBullets.BGrenade;
        this.setExplosionOptions(50, 150, 15);
        this.playShoot();
    }
}
