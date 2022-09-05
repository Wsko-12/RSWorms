import { EWeapons } from '../../../../../../../../../../ts/enums';
import BGrenade from '../../../bullet/throwable/Flight/grenade/BGrenade';
import PowerableWeapon from '../Powerable';

export default class WGrenade extends PowerableWeapon {
    public name = EWeapons.grenade;
    protected bullet = BGrenade;
    constructor() {
        super(EWeapons.grenade);
    }
}
