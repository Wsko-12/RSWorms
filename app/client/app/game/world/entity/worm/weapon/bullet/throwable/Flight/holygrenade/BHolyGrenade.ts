import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightWeapon from '../Flight';

export default class BHolyGrenade extends FlightWeapon {
    constructor(options: IBulletOptions) {
        super(options, EWeapons.holygrenade);
        this.setExplosionOptions(300, 500, 50);
    }
}
