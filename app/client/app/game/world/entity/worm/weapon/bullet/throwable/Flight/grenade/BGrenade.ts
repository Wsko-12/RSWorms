import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import FlightWeapon from '../Flight';

export default class BGrenade extends FlightWeapon {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.grenade);
    }
}
