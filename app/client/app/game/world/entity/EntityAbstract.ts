import { Object3D } from 'three';
import { TLoopCallback } from '../../../../../ts/types';
import { Point2 } from '../../../../utils/geometry';

export default abstract class Entity {
    protected abstract object3D: Object3D;
    protected position: Point2;
    protected radius: number;

    constructor(radius = 1, x = 0, y = 0) {
        this.position = new Point2(x, y);
        this.radius = radius;
    }

    public getObject3D() {
        return this.object3D;
    }

    public update(matrix: number[][]) {
        if (matrix) {
            console.log('a');
        }
    }
}
