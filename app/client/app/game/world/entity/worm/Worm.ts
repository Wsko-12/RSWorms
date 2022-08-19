import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { Vector2 } from '../../../../../utils/geometry';
import Entity from '../Entity';
import Weapon from './weapon/Weapon';

export default class Worm extends Entity {
    protected object3D: Object3D;
    private jumpVectors = {
        usual: new Vector2(1, 1).normalize().scale(5),
        backflip: new Vector2(0.2, 1).normalize().scale(8),
    };
    private hp: number;
    private aimAngle = 0;
    private power = 0;
    private deltaPower = 0.1;
    private currentWeapon = new Weapon();

    constructor(id: string, x = 0, y = 0, hp = 100) {
        super(id, 20, x, y);
        this.id = id;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xc48647, transparent: true, opacity: 0.5 });
        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(x, y, 0);
        this.hp = hp;
    }

    public changePower() {
        // y = x**2
        this.deltaPower += 0.5;
        this.power = this.deltaPower ** 2;
        if (this.power > 100) this.power = 100;
    }

    public getPower() {
        const power = this.power;
        this.power = 0;
        this.deltaPower = 0.1;
        return power;
    }

    public shoot() {
        return this.currentWeapon.shoot({ angle: this.getAimAngle(), power: this.getPower(), position: this.position });
    }

    public changeAngle(direction: number, speed: number) {
        const delta = speed * direction;
        this.aimAngle += delta;
        if (this.aimAngle > 90) this.aimAngle = 90;
        if (this.aimAngle < -45) this.aimAngle = -45;
    }

    public getAimAngle() {
        return this.movesOptions.direction === 1 ? this.aimAngle : 180 - this.aimAngle;
    }

    public getHP() {
        return this.hp;
    }

    public setHP(hp: number) {
        this.hp += hp;
    }

    jump(double?: boolean) {
        this.stable = false;
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
