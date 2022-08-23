import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import ParabolicBullet from '../Parabolic';

export default class BBazooka extends ParabolicBullet {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.bazooka);
    }
}
