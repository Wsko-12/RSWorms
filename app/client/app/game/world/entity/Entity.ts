import { Mesh, Object3D } from 'three';
import { IExplosionOptions, IPhysics } from '../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../ts/types';
import { Point2, Vector2 } from '../../../../utils/geometry';
import MapMatrix from '../worldMap/mapMatrix/MapMatrix';
import Bullet from './worm/weapon/bullet/Bullet';

export default abstract class Entity {
    protected abstract object3D: Object3D | Mesh;
    public position: Point2;
    public radius: number;
    protected radiusUnitAngle: number;
    protected stable = false;
    public id: string;

    protected removeEntityCallback: TRemoveEntityCallback;

    protected physics: IPhysics = {
        velocity: new Vector2(0, 0),
        g: 0.25,
        friction: 0.1,
    };

    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, radius = 1, x = 0, y = 0) {
        this.removeEntityCallback = removeEntityCallback;
        this.id = id;
        this.position = new Point2(x, y);
        this.radius = radius;
        this.radiusUnitAngle = Math.asin(0.5 / this.radius) * 2;
    }

    public getObject3D() {
        return this.object3D;
    }

    public getPositionPoint() {
        return this.position.clone();
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        if (mapMatrix) {
            this.gravity(mapMatrix, entities, wind);
        }

        this.object3D.position.set(this.position.x, this.position.y, 0);
    }

    protected checkCollision(
        mapMatrix: MapMatrix,
        entities: Entity[],
        vec: Vector2,
        radAngleShift = this.radiusUnitAngle
    ) {
        const { matrix } = mapMatrix;
        let responseX = 0;
        let responseY = 0;

        let collision = false;

        const potentialX = this.position.x + vec.x;
        const potentialY = this.position.y + vec.y;
        const vecAngle = Math.atan2(vec.y, vec.x);
        const PIhalf = Math.PI / 2;

        const startAngle = vecAngle - PIhalf + radAngleShift;
        const endAngle = vecAngle + PIhalf - radAngleShift;

        for (let ang = startAngle; ang < endAngle; ang += this.radiusUnitAngle) {
            const x = this.radius * Math.cos(ang) + potentialX;
            const y = this.radius * Math.sin(ang) + potentialY;
            const point = new Point2(x, y);

            entities.forEach((entity) => {
                if (entity != this) {
                    const dist = point.getDistanceToPoint(entity.position);
                    if (dist <= entity.radius) {
                        entity.stable = false;
                        collision = true;
                        responseX += x - this.position.x;
                        responseY += y - this.position.y;
                    }
                }
            });

            const iX = Math.floor(x);
            const iY = Math.floor(y);

            if (iX < 0) {
                return null;
            }
            if (iX >= matrix[0].length) {
                return null;
            }

            if (iY < 0) {
                return null;
            }
            if (iY >= matrix.length) {
                return null;
            }

            if (matrix[iY] && matrix[iY][iX] && matrix[iY][iX] !== 0) {
                responseX += x - this.position.x;
                responseY += y - this.position.y;
                collision = true;
            }
        }

        return collision ? new Vector2(responseX, responseY) : null;
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

        this.handleCollision(mapMatrix, entities);

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

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]) {
        return;
    }

    public setStable(flag: boolean) {
        this.stable = flag;
    }

    public remove() {
        this.removeEntityCallback(this);
    }

    public push(vec: Vector2) {
        const { velocity } = this.physics;
        velocity.x += vec.x;
        velocity.y += vec.y;
    }

    public acceptExplosion(mapMatrix: MapMatrix, entities: Entity[], options: IExplosionOptions) {
        //mapMatrix and entities needs for example for barrels we create method explode
        const vec = new Vector2(this.position.x - options.point.x, this.position.y - options.point.y);
        const dist = vec.getLength() - this.radius;

        const force = (options.radius - dist) / options.radius;
        if (force <= 0) {
            return;
        }
        vec.normalize().scale(force * options.kickForce);
        console.log(vec);

        this.push(vec);
    }
}
