import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.dynamite);
    }
}
