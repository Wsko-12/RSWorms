import { EWeapons } from '../../../../../../../../../../ts/enums';
import BDynamite from '../../../bullet/throwable/Fallen/dynamite/BDynamite';
import StaticWeapon from '../Static';

export default class WDynamite extends StaticWeapon {
    protected name = EWeapons.dynamite;
    protected bullet = BDynamite;

    constructor() {
        super(EWeapons.dynamite);
    }
}
