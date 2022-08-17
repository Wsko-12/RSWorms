import { Object3D } from 'three';
import { IPhysics } from '../../../../../ts/interfaces';
import { Point2, Vector2 } from '../../../../utils/geometry';

export default abstract class Entity {
    protected abstract object3D: Object3D;
    protected position: Point2;
    protected radius: number;
    protected radiusUnitAngle: number;
    protected stable = false;
    protected physics: IPhysics = {
        acceleration: new Vector2(0, 0),
        velocity: new Vector2(0, 0),
        g: 0.1,
        friction: 0.2,
    };

    constructor(radius = 1, x = 0, y = 0) {
        this.position = new Point2(x, y);
        this.radius = radius;
        this.radiusUnitAngle = Math.asin(0.5 / this.radius) * 2;
    }

    public getObject3D() {
        return this.object3D;
    }

    public update(matrix: number[][]) {
        if (matrix) {
            this.gravity(matrix);
        }

        this.object3D.position.set(this.position.x, this.position.y, 0);
    }

    protected checkCollision(matrix: number[][], vec: Vector2, radAngleShift = this.radiusUnitAngle) {
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

            let iX = Math.floor(x);
            let iY = Math.floor(y);

            if (iX < 0) {
                iX = 0;
            }
            if (iX >= matrix[0].length) {
                iX = matrix[0].length - 1;
            }

            if (iY < 0) {
                iY = 0;
            }
            if (iY >= matrix.length) {
                iY = matrix.length - 1;
            }

            if (matrix[iY] && matrix[iY][iX] && matrix[iY][iX] !== 0) {
                responseX += x - this.position.x;
                responseY += y - this.position.y;
                collision = true;
            }
        }

        return collision ? new Vector2(responseX, responseY) : null;
    }

    protected gravity(matrix: number[][]) {
        if (this.stable) {
            return;
        }

        const acc = this.physics.acceleration.clone();
        acc.y -= this.physics.g;
        const vel = this.physics.velocity.clone();
        vel.add(acc);

        vel.setStart(this.position);

        this.stable = false;

        this.physics.acceleration.y = 0;
        this.physics.acceleration.x = 0;

        const collision = this.checkCollision(matrix, vel);
        if (!collision) {
            this.position.x += vel.x;
            this.position.y += vel.y;
            this.physics.acceleration = acc;
            return;
        }

        //normal here isn't mean 'normalize'
        const normalSurface = collision.normalize().scale(1);
        normalSurface.setStart(this.position);

        const dot = vel.dotProduct(normalSurface);
        const reflectionX = (vel.x - 2 * dot * normalSurface.x) * this.physics.friction;
        const reflectionY = (vel.y - 2 * dot * normalSurface.y) * this.physics.friction;

        const reflectedVector = new Vector2(reflectionX, reflectionY);
        reflectedVector.setStart(this.position);

        this.physics.velocity = reflectedVector;
        if (this.physics.velocity.getLength() < 0.01) {
            this.physics.acceleration.y = 0;
            this.stable = true;
        }
    }
}
