import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    constructor(options: IBulletOptions) {
        super(options, EWeapons.dynamite);
        this.explosion = {
            damage: 70,
            radius: 300,
            kick: 30,
        }
    }
}
