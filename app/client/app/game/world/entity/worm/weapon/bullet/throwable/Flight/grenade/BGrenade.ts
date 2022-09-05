import { EBullets, ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightBullet from '../Flight';

export default class BGrenade extends FlightBullet {
    public type: EBullets;
    protected collisionSound = ESoundsBullet.grenadeCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.grenade);
        this.type = EBullets.BGrenade;
        this.setExplosionOptions(50, 150, 15);
    }
}
