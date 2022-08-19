import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three/src/Three';
import { Point2 } from '../../../../utils/geometry';
import Entity from './Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    constructor(id: string, position: Point2) {
        super(id, 10, position.x, position.y);

        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(position.x, position.y, 0);
    }
}
