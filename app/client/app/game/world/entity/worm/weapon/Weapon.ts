import { IShootOptions } from '../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../ts/types';
import { Vector2 } from '../../../../../../utils/geometry';
import Bullet from './bullet/Bullet';

export default class Weapon {
    shoot(options: IShootOptions, removeEntityCallback: TRemoveEntityCallback) {
        let { angle } = options;
        const { power, position } = options;
        angle = (angle / 180) * Math.PI;
        const shootVector = new Vector2();
        Vector2.rotate(shootVector, angle);
        const bullet = new Bullet(removeEntityCallback, Math.random().toString(), position);
        bullet.push(shootVector.normalize().scale(power / 5));
        return bullet;
    }
}
