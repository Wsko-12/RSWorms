import { ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightWeapon from '../Flight';

export default class BGrenade extends FlightWeapon {
    protected collisionSound = ESoundsBullet.grenadeCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.grenade);
        this.setExplosionOptions(50, 150, 15);
    }
}
