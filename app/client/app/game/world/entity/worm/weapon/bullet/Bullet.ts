import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three/src/Three';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Point2 } from '../../../../../../../utils/geometry';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    protected explosionRadius = 100;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, position: Point2) {
        super(removeEntityCallback, id, 10, position.x, position.y);
        this.physics.friction = 0.5;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(position.x, position.y, 0);
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        super.handleCollision(mapMatrix, entities);
        this.remove();
    }
}
