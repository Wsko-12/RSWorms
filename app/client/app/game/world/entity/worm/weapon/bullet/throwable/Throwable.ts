import { EConstants, EWeapons } from '../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../ts/interfaces';
import MapMatrix from '../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../Entity';
import Bullet from '../Bullet';

export default abstract class ThrowableBullet extends Bullet {
    protected isActivated = false;
    protected timer = Date.now();
    constructor(options: IBulletOptions, textureName: EWeapons) {
        super(options, textureName);
        this.physics.friction = 0.4;
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        return;
    }

    protected activate(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number) {
        this.isActivated = true;
        this.explode(mapMatrix, entities, waterLevel);
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number): void {
        if (Date.now() - this.timer > EConstants.throwableExplosionDelay && !this.isActivated) {
            this.activate(mapMatrix, entities, waterLevel);
        }
        super.update(mapMatrix, entities, wind, waterLevel);
    }

    public readyToNextTurn(): boolean {
        return this.isActivated;
    }
}
