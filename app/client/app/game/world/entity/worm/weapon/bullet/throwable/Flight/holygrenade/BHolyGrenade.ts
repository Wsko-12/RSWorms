import {
    EBullets,
    EConstants,
    ESoundsBullet,
    ESoundsWeapon,
    EWeapons,
} from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import SoundManager from '../../../../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import FlightBullet from '../Flight';

export default class BHolyGrenade extends FlightBullet {
    public type: EBullets;
    isSounded = false;
    throwableExplosionDelay = 7200;
    protected shootSound = ESoundsWeapon.throwRelease;
    protected collisionSound = ESoundsBullet.holyGrenadeCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.holygrenade);
        this.type = EBullets.BHolyGrenade;
        this.setExplosionOptions(90, 400, 30);
        this.playShoot();
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number): void {
        if (Date.now() - this.timer > this.throwableExplosionDelay - 2200 && !this.isActivated && !this.isSounded) {
            this.isSounded = true;
            SoundManager.playWeapon(ESoundsWeapon.holyGrenade);
        }
        super.update(mapMatrix, entities, wind, waterLevel);
    }
}
