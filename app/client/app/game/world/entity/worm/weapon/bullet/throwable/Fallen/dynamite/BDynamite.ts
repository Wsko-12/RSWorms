import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    constructor(removeEntityCallback: TRemoveEntityCallback, options: IBulletOptions) {
        super(removeEntityCallback, options, EWeapons.dynamite);
    }
}
