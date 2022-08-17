import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import Entity from './Entity';

export default class Worm extends Entity {
    protected object3D: Object3D;
    constructor(x = 0, y = 0) {
        super(20, x, y);
        this.physics.friction = 0.1;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xc48647, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(x, y, 0);
    }
    // name: string;
    // hp: number;
    // team: Team;
    // constructor(name: string, hp = 100, team: Team) {
    //     super(1, 1, 1); /* temporarily */
    //     this.name = name;
    //     this.hp = hp;
    //     this.team = team;
    // }
}
