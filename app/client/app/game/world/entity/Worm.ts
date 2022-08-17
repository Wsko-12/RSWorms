import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from 'three';
import { Point2 } from '../../../../utils/geometry';
import Entity from './EntityAbstract';
import Team from './Team';

export default class Worm extends Entity {
    protected object3D: Object3D;
    constructor(x = 0, y = 0) {
        super(2, x, y);
        const geometry = new CircleBufferGeometry(50, 120);
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
