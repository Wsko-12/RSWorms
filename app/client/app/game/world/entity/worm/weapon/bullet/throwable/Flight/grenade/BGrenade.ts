import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightWeapon from '../Flight';

export default class BGrenade extends FlightWeapon {
    constructor(options: IBulletOptions) {
        super(options, EWeapons.grenade);
        this.setExplosionOptions(70, 150, 15);
    }
}
