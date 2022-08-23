import { EConstants, EWeapons } from '../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../ts/types';
import MapMatrix from '../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../Entity';
import Bullet from '../Bullet';

export default abstract class ThrowableBullet extends Bullet {
    protected isActivated = false;
    protected timer = Date.now();
    constructor(
        removeEntityCallback: TRemoveEntityCallback,
        id: string,
        options: IBulletOptions,
        textureName: EWeapons
    ) {
        super(removeEntityCallback, id, options, textureName);
        this.physics.friction = 0.4;
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        return;
    }

    protected activate(mapMatrix: MapMatrix, entities: Entity[]) {
        this.explode(mapMatrix, entities);
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number): void {
        if (Date.now() - this.timer > EConstants.throwableExplosionDelay) {
            this.activate(mapMatrix, entities);
        }
        super.update(mapMatrix, entities, wind);
    }
}
