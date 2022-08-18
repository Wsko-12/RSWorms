import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D, Scene } from 'three';
import { Vector2 } from '../../../../utils/geometry';
import Entity from './Entity';

export default class Worm extends Entity {
    protected object3D: Object3D;
    private jumpVectors = {
        usual: new Vector2(1, 1).normalize().scale(5),
        backflip: new Vector2(0.2, 1).normalize().scale(8),
    };

    constructor(x = 0, y = 0) {
        super(20, x, y);
        // this.physics.friction = 0.1;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xc48647, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(x, y, 0);
    }

    jump(double?: boolean) {
        const vec = double ? this.jumpVectors.backflip.clone() : this.jumpVectors.usual.clone();
        vec.x *= this.movesOptions.direction;
        if (double) {
            vec.x *= -1;
        }
        if (this.physics.velocity.getLength() < 0.5) {
            this.push(vec);
        }
    }
}
