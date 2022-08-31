import { ELang, ESoundsWeapon, ESoundsWormSpeech, EWeapons } from '../../../../../../../../../../ts/enums';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import BMine from '../../../bullet/throwable/Fallen/mine/Bmine';
import StaticWeapon from '../Static';

export default class WMine extends StaticWeapon {
    protected name = EWeapons.mine;
    protected shootSound = ESoundsWormSpeech.mineArm;
    protected bullet = BMine;

    constructor() {
        super(EWeapons.mine);
    }

    protected playShoot(): void {
        SoundManager.playWormSpeech(ELang.rus, this.shootSound);
    }
}
