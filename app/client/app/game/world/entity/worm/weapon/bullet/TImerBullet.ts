import { IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';
import Bullet from './Bullet';

export default class TimerBullet extends Bullet {
    start = performance.now();
    timer: number;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions) {
        super(removeEntityCallback, id, options);
        this.physics.friction = 0.4;
        this.timer = options.timer || 5;
    }

    isItTimeToBlow(mapMatrix: MapMatrix, entities: Entity[]) {
        console.log((performance.now() - this.start) / 1000);
        const isTime = (performance.now() - this.start) / 1000 > this.timer;
        if (isTime) this.handleCollision(mapMatrix, entities);
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        if (mapMatrix) {
            this.isItTimeToBlow(mapMatrix, entities);
            this.gravity(mapMatrix, entities, wind);
        }

        this.object3D.position.set(this.position.x, this.position.y, 0);
    }

    protected gravity(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        if (this.stable) {
            return;
        }

        const vel = this.physics.velocity.clone();
        vel.y -= this.physics.g;

        const collision = this.checkCollision(mapMatrix, entities, vel);

        if (!collision) {
            this.position.x += this instanceof Bullet ? vel.x : 0;
            this.position.y += vel.y;
            this.physics.velocity = vel;
            return;
        }

        // this.handleCollision(mapMatrix, entities);

        //normal here isn't mean 'normalize'
        const normalSurface = collision.normalize().scale(1);

        const dot = vel.dotProduct(normalSurface);
        const reflectionX = vel.x - 2 * dot * normalSurface.x;
        const reflectionY = vel.y - 2 * dot * normalSurface.y;

        const reflectedVector = new Vector2(reflectionX, reflectionY);

        const fallSpeed = this.physics.velocity.getLength() * this.physics.friction;
        this.physics.velocity = reflectedVector.normalize().scale(fallSpeed);

        if (this.physics.velocity.getLength() < 0.01) {
            this.physics.velocity.scale(0);
            this.stable = true;
        }
    }
}
