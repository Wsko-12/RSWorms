import RayBullet from '../Ray';

export default class BShotgun extends RayBullet {
    protected explosion = {
        damage: 25,
        radius: 75,
        kick: 5,
    };
}
