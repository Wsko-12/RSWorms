import { ELang, ESoundsBullet, ESoundsWeapon, ESoundsWormSpeech, EWeapons } from '../../../../../../../../../../ts/enums';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import BDynamite from '../../../bullet/throwable/Fallen/dynamite/BDynamite';
import StaticWeapon from '../Static';

export default class WDynamite extends StaticWeapon {
    protected name = EWeapons.dynamite;
    protected shootSound = ESoundsWormSpeech.bye;
    protected bullet = BDynamite;

    constructor() {
        super(EWeapons.dynamite);
    }

    protected playShoot(): void {
        SoundManager.playWormSpeech(ELang.rus, this.shootSound);
    }
}
