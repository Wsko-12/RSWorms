import { resolve } from 'path';
import { ESoundsBullet, ESoundsWeapon, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import SoundManager from '../../../../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import FlightWeapon from '../Flight';

export default class BHolyGrenade extends FlightWeapon {
    protected collisionSound = ESoundsBullet.holyGrenadeCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.holygrenade);
        this.setExplosionOptions(90, 400, 30);
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        SoundManager.playWeapon(ESoundsWeapon.holyGrenade);
        setTimeout(() => super.explode(mapMatrix, entities, waterLevel), 2300);
    }
}
