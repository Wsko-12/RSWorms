import { EBullets, EWeapons, ESoundsBullet } from '../../../../../../../../../../../ts/enums';

import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightWeapon from '../Flight';

export default class BGrenade extends FlightWeapon {
    public type: EBullets;

    protected collisionSound = ESoundsBullet.grenadeCollision;

    constructor(options: IBulletOptions) {
        super(options, EWeapons.grenade);
        this.type = EBullets.BGrenade;
        this.setExplosionOptions(70, 150, 15);
    }
}
