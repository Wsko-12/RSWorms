import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import FallenWeapon from '../Fallen';

export default class BDynamite extends FallenWeapon {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.dynamite);
    }
}
