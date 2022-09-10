import { EBullets, ELang, ESoundsBullet, ESoundsWormSpeech, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import SoundManager from '../../../../../../../../../soundManager/SoundManager';
import FallenBullet from '../Fallen';

export default class BDynamite extends FallenBullet {
    public type: EBullets;
    protected shootSound = ESoundsWormSpeech.dinamyteArm;
    protected collisionSound = ESoundsBullet.dinamyte;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.dynamite);
        this.setExplosionOptions(70, 250, 15);
        this.physics.friction = 0;
        this.type = EBullets.BDynamite;
        this.playShoot();
    }

    protected playShoot() {
        SoundManager.playWormSpeech(ELang.rus, this.shootSound);
    }
}
