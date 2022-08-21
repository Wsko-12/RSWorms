import { IShootOptions } from '../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../ts/types';
import TimerBullet from '../TImerBullet';

export default class GrenadeBullet extends TimerBullet {
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions) {
        super(removeEntityCallback, id, options);
        this.physics.friction = 0.4;
    }
}
