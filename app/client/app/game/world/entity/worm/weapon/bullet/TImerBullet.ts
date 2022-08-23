import { IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';
import Bullet from './Bullet';

export default class TimerBullet extends Bullet {
    start = performance.now();
    timer: number;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions, textureName: string) {
        super(removeEntityCallback, id, options, textureName);
        this.physics.friction = 0.4;
        this.timer = options.timer || 5;
    }

    protected isItTimeToBlow(mapMatrix: MapMatrix, entities: Entity[]) {
        const isTime = (performance.now() - this.start) / 1000 > this.timer;
        if (isTime) this.explode(mapMatrix, entities);
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        if (mapMatrix) {
            this.isItTimeToBlow(mapMatrix, entities);
            this.gravity(mapMatrix, entities, wind);
        }
        this.updateObjectRotation();

        this.object3D.position.set(this.position.x, this.position.y, 0);
    }

    protected handleCollision() {
        return;
    }
}
