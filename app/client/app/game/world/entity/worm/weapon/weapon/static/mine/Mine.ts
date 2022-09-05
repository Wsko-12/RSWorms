import { ELang, ESoundsWormSpeech, EWeapons } from '../../../../../../../../../../ts/enums';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import BMine from '../../../bullet/throwable/Fallen/mine/Bmine';
import StaticWeapon from '../Static';

export default class WMine extends StaticWeapon {
    public name = EWeapons.mine;
    protected bullet = BMine;

    constructor() {
        super(EWeapons.mine);
    }
}
