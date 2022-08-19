import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three/src/Three';
import { IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    protected explosionRadius = 100;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions) {
        let { angle } = options;
        const { power, position, parentRadius } = options;
        angle = (angle / 180) * Math.PI;
        super(removeEntityCallback, id, 10, position.x, position.y);

        this.position.x += Math.cos(angle) * (parentRadius + this.radius + 1);
        this.position.y += Math.sin(angle) * (parentRadius + this.radius + 1);

        this.physics.friction = 0.5;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(this.position.x, this.position.y, 0);

        const shootVector = new Vector2();
        Vector2.rotate(shootVector, angle);
        this.push(shootVector.normalize().scale(power / 5));
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        super.handleCollision(mapMatrix, entities);
        this.remove();
    }
}
