import { ESoundsWeapon, EWeapons } from '../../../../../../../../../../ts/enums';
import BHolyGrenade from '../../../bullet/throwable/Flight/holygrenade/BHolyGrenade';
import PowerableWeapon from '../Powerable';

export default class WHolyGrenade extends PowerableWeapon {
    public name = EWeapons.holygrenade;
    protected shootSound = ESoundsWeapon.throwRelease;
    protected bullet = BHolyGrenade;
    constructor() {
        super(EWeapons.holygrenade);
    }
}
