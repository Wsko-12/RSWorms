import { IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import BazookaBullet from '../bullet/Bazooka-bullet/Bazooka-bullet';
import Weapon from '../Weapon';

export default class Bazooka extends Weapon {
    constructor() {
        super();
        this.bulletType = BazookaBullet;
    }
}
