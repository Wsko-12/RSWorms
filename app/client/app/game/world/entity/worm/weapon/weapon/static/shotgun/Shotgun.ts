import SocketsManager from '../../../../../../../../../../server/app/managers/socketsManager/SocketsManager';
import { ESoundsWeapon, EWeapons } from '../../../../../../../../../../ts/enums';
import { IShootOptions, IBulletOptions } from '../../../../../../../../../../ts/interfaces';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import BShotgun from '../../../bullet/shottable/ray/Shotgun/BShotgun';
import PowerableWeapon from '../../powerable/Powerable';
import StaticWeapon from '../Static';

export default class WShotgun extends PowerableWeapon {
    protected name = EWeapons.shotgun;
    protected shootSound = ESoundsWeapon.shotgunShoot;
    protected bullet = BShotgun;

    constructor() {
        super(EWeapons.shotgun);
        this.aimOptions.hideAim = false;
        this.aim.hide(this.aimOptions.hidePower, this.aimOptions.hideAim);
    }

    public shoot(options: IShootOptions) {
        const { angle, power } = this.aim.getShootDirection(options.wormDirection);
        const bulletOptions: IBulletOptions = {
            angle,
            power,
            position: options.position,
            parentRadius: options.parentRadius,
        };
        const bullet = new this.bullet(bulletOptions, this.name);
        this.playShoot();
        return bullet;
    }
}
