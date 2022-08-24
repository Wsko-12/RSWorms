import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import FlightWeapon from '../Flight';

export default class BGrenade extends FlightWeapon {
    constructor(removeEntityCallback: TRemoveEntityCallback, options: IBulletOptions) {
        super(removeEntityCallback, options, EWeapons.grenade);
    }
}
