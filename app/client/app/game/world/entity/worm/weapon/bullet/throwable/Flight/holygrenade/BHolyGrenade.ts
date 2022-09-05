import { EBullets, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FlightWeapon from '../Flight';

export default class BHolyGrenade extends FlightWeapon {
    public type: EBullets;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.holygrenade);
        this.type = EBullets.BHolyGrenade;
        this.setExplosionOptions(300, 500, 50);
    }
}
