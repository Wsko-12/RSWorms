import { ESoundsWeapon, EWeapons } from '../../../../../../../../../../ts/enums';
import BGrenade from '../../../bullet/throwable/Flight/grenade/BGrenade';
import PowerableWeapon from '../Powerable';

export default class WGrenade extends PowerableWeapon {
    protected name = EWeapons.grenade;
    protected shootSound = ESoundsWeapon.throwRelease;
    protected bullet = BGrenade;
    constructor() {
        super(EWeapons.grenade);
    }
}
