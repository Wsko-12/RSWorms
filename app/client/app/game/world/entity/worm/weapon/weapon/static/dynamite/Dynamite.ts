import {
    ELang,
    ESoundsBullet,
    ESoundsWeapon,
    ESoundsWormSpeech,
    EWeapons,
} from '../../../../../../../../../../ts/enums';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import BDynamite from '../../../bullet/throwable/Fallen/dynamite/BDynamite';
import StaticWeapon from '../Static';

export default class WDynamite extends StaticWeapon {
    public name = EWeapons.dynamite;
    protected bullet = BDynamite;

    constructor() {
        super(EWeapons.dynamite);
    }
}
