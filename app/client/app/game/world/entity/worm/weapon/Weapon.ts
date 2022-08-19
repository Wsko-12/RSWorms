import { IShootOptions } from '../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../ts/types';
import Bullet from './bullet/Bullet';

export default class Weapon {
    shoot(options: IShootOptions, removeEntityCallback: TRemoveEntityCallback) {
        const bullet = new Bullet(removeEntityCallback, Math.random().toString(), options);
        return bullet;
    }
}
