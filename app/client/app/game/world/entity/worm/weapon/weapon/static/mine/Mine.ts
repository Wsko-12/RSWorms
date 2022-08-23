import { EWeapons } from '../../../../../../../../../../ts/enums';
import BDynamite from '../../../bullet/throwable/Fallen/dynamite/BDynamite';
import FallenWeapon from '../../../bullet/throwable/Fallen/Fallen';
import BMine from '../../../bullet/throwable/Fallen/mine/Bmine';
import StaticWeapon from '../Static';

export default class WMine extends StaticWeapon {
    protected name = EWeapons.mine;
    protected bullet = BMine;

    constructor() {
        super(EWeapons.mine);
    }
}
