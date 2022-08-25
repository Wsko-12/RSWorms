import { EWeapons } from '../../../../../../../../../../ts/enums';
import Bullet from '../../../bullet/Bullet';
import BShotgun from '../../../bullet/shottable/ray/shotgun/Shotgun';
import StaticWeapon from '../Static';

export default class WShotgun extends StaticWeapon {
    protected name = EWeapons.shotgun;
    protected bullet = BShotgun;
    protected aimOptions = {
        hideAim: false,
        hidePower: true,
    };

    constructor() {
        super(EWeapons.shotgun);
        this.aim.hide(this.aimOptions.hidePower, this.aimOptions.hideAim);
        // this.aim.power = 100;
        console.log(this.aim);
    }
}
