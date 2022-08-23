import GrenadeBullet from '../bullet/Grenade-bullet/GrenadeBullet';
import TimerWeapon from '../TimerWeapon';

export default class Grenade extends TimerWeapon {
    constructor() {
        super('grenade');
        this.bulletType = GrenadeBullet;
    }
}
