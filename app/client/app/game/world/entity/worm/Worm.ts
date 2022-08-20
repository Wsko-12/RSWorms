import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { IShootOptions } from '../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../ts/types';
import { Vector2 } from '../../../../../utils/geometry';
import MapMatrix from '../../worldMap/mapMatrix/MapMatrix';
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
    private currentWeapon: Weapon;

    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, x = 0, y = 0, hp = 100) {
        super(removeEntityCallback, id, 20, x, y);
        this.currentWeapon = new Weapon();
        this.id = id;
        this.physics.friction = 0.2;
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
        const options: IShootOptions = {
            angle: this.getAimAngle(),
            power: this.getPower(),
            position: this.position.clone(),
            parentRadius: this.radius,
        };

        return this.currentWeapon.shoot(options, this.removeEntityCallback);
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

    public jump(double?: boolean) {
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

    protected gravity(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        if (this.stable) {
            return;
        }

        const vel = this.physics.velocity.clone();
        vel.y -= this.physics.g;

        const collision = this.checkCollision(mapMatrix, entities, vel);

        if (!collision) {
            this.position.x += vel.x;
            this.position.y += vel.y;
            this.physics.velocity = vel;
            return;
        }

        this.handleCollision(mapMatrix, entities);

        //normal here isn't mean 'normalize'
        const normalSurface = collision.normalize().scale(-1);
        const velClone = vel.clone().normalize().scale(-1);

        const slideAngle = Math.PI / 2 - Math.acos(normalSurface.dotProduct(velClone));
        const isSlide = slideAngle < Math.PI / 3;

        if (isSlide) {
            // чтобы он нормально скользил, надо дать ему высокий friction
            const friction = 0.8;
            // смотрим скорость падения
            let speed = vel.getLength() * friction;

            // фикс бага скользит в прышках и не может подняться на горки
            // надо сделать какую-то нормальную проверку
            // убери ее, если хочешь, чтобы он скользил дольше
            if (speed < 4) {
                speed = 0;
            }
            //смотрим, куда был направлен вектор падения по x
            const x = vel.x > 0 ? 1 : -1;

            //создаем новый вектор (просто влево или вправо)
            const newVec = new Vector2(x, 0);
            // увеличиаваем его длинну в нашу скорость падения
            newVec.scale(speed);
            // добавляем ему вектор поверхности, чтобы получить вектор куда скользить
            newVec.add(normalSurface);
            // нормализуем его и делаем длиной в нашу скорость
            newVec.normalize().scale(speed);
            // и просто на следующий фрейм скидываем этот вектор
            this.physics.velocity = newVec;
        } else {
            const dot = vel.dotProduct(normalSurface);

            const reflectionX = vel.x - 2 * dot * normalSurface.x;
            const reflectionY = vel.y - 2 * dot * normalSurface.y;
            const reflectedVector = new Vector2(reflectionX, reflectionY);
            const fallSpeed = this.physics.velocity.getLength() * this.physics.friction;
            this.physics.velocity = reflectedVector.normalize().scale(fallSpeed);
        }

        if (this.physics.velocity.getLength() < 0.01) {
            this.physics.velocity.scale(0);
            this.stable = false;
        }
    }
}
