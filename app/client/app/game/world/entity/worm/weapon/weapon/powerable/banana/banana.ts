import { rejects } from 'assert';
import { EWeapons, ESoundsWeapon } from '../../../../../../../../../../ts/enums';
import { IShootOptions, IBulletOptions } from '../../../../../../../../../../ts/interfaces';
import BBananaGrenade from '../../../bullet/throwable/Flight/bananagrenade/BBananaGrenade';
import BGrenade from '../../../bullet/throwable/Flight/grenade/BGrenade';
import PowerableWeapon from '../Powerable';

export default class WBanana extends PowerableWeapon {
    public name = EWeapons.banana;
    protected shootSound = ESoundsWeapon.throwRelease;
    protected bullet = BBananaGrenade;
    constructor() {
        super(EWeapons.banana);
    }

    public shoot(options: IShootOptions) {
        const { angle, power } = this.aim.getShootDirection(options.wormDirection);
        const bulletOptions: IBulletOptions = {
            angle,
            power,
            position: options.position,
            parentRadius: options.parentRadius,
        };
        const bullet = new this.bullet(bulletOptions);
        this.playShoot();
        return bullet;
    }
}
