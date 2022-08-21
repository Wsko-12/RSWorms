import { IShootOptions } from '../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../ts/types';
import Bullet from '../Bullet';

export default class BazookaBullet extends Bullet {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions) {
        super(removeEntityCallback, id, options);
    }
}
