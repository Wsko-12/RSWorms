import BazookaBullet from '../bullet/Bazooka-bullet/Bazooka-bullet';
import Weapon from '../Weapon';

export default class Bazooka extends Weapon {
    constructor() {
        super('bazooka');
        this.bulletType = BazookaBullet;
    }
}
