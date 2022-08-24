import { EWeapons } from '../../../../../../../../../../ts/enums';
import BMine from '../../../bullet/throwable/Fallen/mine/Bmine';
import StaticWeapon from '../Static';

export default class WMine extends StaticWeapon {
    protected name = EWeapons.mine;
    protected bullet = BMine;

    constructor() {
        super(EWeapons.mine);
    }
}
