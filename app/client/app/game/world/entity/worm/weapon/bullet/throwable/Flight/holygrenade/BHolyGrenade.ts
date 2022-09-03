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
        this.setExplosionOptions(300, 500, 50);
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        console.log('explode');
        SoundManager.playWeapon(ESoundsWeapon.holyGrenade);
        setTimeout(() => super.explode(mapMatrix, entities, waterLevel), 2300);
        // console.log(SoundManager.weapon.hasOwnProperty('onended'));
        SoundManager.weapon.onpause = () => console.log('hi');
        (SoundManager.weapon as HTMLAudioElement).addEventListener('ended', () => {
            console.log('ended');
        });
    }
}
