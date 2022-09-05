import { ESoundsWeapon, EWeapons } from '../../../../../../../../../../ts/enums';
import BBazooka from '../../../bullet/shottable/parabolic/bazooka/BBazooka';
import PowerableWeapon from '../Powerable';

export default class WBazooka extends PowerableWeapon {
    public name = EWeapons.bazooka;
    protected shootSound = ESoundsWeapon.rocketRelease;
    protected bullet = BBazooka;

    constructor() {
        super(EWeapons.bazooka);
    }
}
