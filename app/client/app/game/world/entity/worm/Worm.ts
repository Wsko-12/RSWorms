import { CircleBufferGeometry, Color, Group, Mesh, MeshBasicMaterial } from 'three';
import { ELayersZ } from '../../../../../../ts/enums';
import { IExplosionOptions, IShootOptions, IWormMoveStates } from '../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../ts/types';
import { Vector2 } from '../../../../../utils/geometry';
import MapMatrix from '../../worldMap/mapMatrix/MapMatrix';
import Entity from '../Entity';
import Aim from './aim/Aim';
import Bazooka from './weapon/Bazooka/Bazooka';
import Grenade from './weapon/Grenade/Grenade';
import Weapon from './weapon/Weapon';

export default class Worm extends Entity {
    protected object3D: Group;
    private wormMesh: Mesh;
    private aim = new Aim();
    private fallToJumpCoef = 1.2;

    public isSelected = false;
    private jumpVectors = {
        usual: new Vector2(1, 1).normalize().scale(5),
        backflip: new Vector2(0.2, 1).normalize().scale(8),
    };

    // for animations
    private moveStates: IWormMoveStates = {
        isSlide: false,
        isMove: false,
        isJump: false,
        isFall: true,
        isDamaged: false,
    };

    //temporary
    private lastDamageTimestamp = 0;

    public movesOptions = {
        flags: {
            left: false,
            right: false,
        },
        direction: 1,
        speed: 1.5,
        a: new Vector2(0, 0),
        v: new Vector2(0, 0),
        maxAngle: 80,
    };

    private hp: number;
    private currentWeapon: Weapon | null;
    private weapons: Weapon[];

    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, x = 0, y = 0, hp = 100) {
        super(removeEntityCallback, id, 20, x, y);
        this.currentWeapon = null;
        this.weapons = [new Bazooka(), new Grenade()];
        this.id = id;
        this.physics.friction = 0.1;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xc48647, transparent: true, opacity: 0.5 });
        this.object3D = new Group();
        this.wormMesh = new Mesh(geometry, material);

        this.object3D.add(this.wormMesh, this.aim.getObject3D());
        this.object3D.position.set(x, y, ELayersZ.worms);
        this.hp = hp;
    }

    changeWeapon() {
        if (this.currentWeapon instanceof Bazooka) this.currentWeapon = this.weapons[1];
        else this.currentWeapon = this.weapons[0];
        console.log(this.currentWeapon);
    }

    changeWeaponTimer() {
        if (this.currentWeapon instanceof Grenade) this.currentWeapon.changeTimer(); 
    }

    public setAsSelected(flag: boolean) {
        this.isSelected = flag;
    }

    public setMoveFlags(flags: { left?: boolean; right?: boolean }) {
        this.stable = false;
        Object.assign(this.movesOptions.flags, flags);
    }

    public shoot() {
        if (!this.currentWeapon) return;
        const { power, angle } = this.aim.getShootData(this.movesOptions.direction);
        const options: IShootOptions = {
            angle,
            power,
            position: this.position.clone(),
            parentRadius: this.radius,
        };

        return this.currentWeapon.shoot(options, this.removeEntityCallback);
    }

    public changeAim(direction: number, speed: number, power: boolean) {
        if (!this.currentWeapon) return;
        this.aim.changeAngle(direction, speed);
        if (power) {
            this.aim.changePower();
        }
    }

    public getHP() {
        return this.hp;
    }

    public setHP(hp: number) {
        this.hp += hp;
    }

    public jump(double?: boolean) {
        if (this.moveStates.isFall || this.moveStates.isJump || this.moveStates.isSlide || this.moveStates.isDamaged) {
            return;
        }
        const vec = double ? this.jumpVectors.backflip.clone() : this.jumpVectors.usual.clone();
        vec.x *= this.movesOptions.direction;
        if (double) {
            vec.x *= -1;
        }
        this.moveStates.isJump = true;
        this.push(vec);
    }

    public isMoves() {
        return this.moveStates.isMove;
    }

    protected gravity(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        const vel = this.physics.velocity.clone();
        vel.y -= this.physics.g;
        if (this.moveStates.isJump && this.moveStates.isFall) {
            this.moveStates.isFall = false;
        }

        const collision = this.checkCollision(mapMatrix, entities, vel);
        if (this.moveStates.isSlide) {
            const groundCollision = this.checkCollision(mapMatrix, entities, new Vector2(0, -1).scale(this.radius));
            if (!groundCollision) {
                this.moveStates.isSlide = false;
                this.moveStates.isFall = true;
            }
        }
        if (!collision) {
            if (vel.getLength() > this.jumpVectors.backflip.getLength() * this.fallToJumpCoef) {
                this.moveStates.isFall = true;
                this.moveStates.isJump = false;
            }
            this.position.x += vel.x;
            this.position.y += vel.y;
            this.physics.velocity = vel;
            return;
        }

        this.handleCollision(mapMatrix, entities);

        const normalSurface = collision.normalize().scale(-1);
        const velClone = vel.clone().normalize().scale(-1);
        const slideAngle = Math.PI / 2 - Math.acos(normalSurface.dotProduct(velClone));
        const fallSpeed = vel.getLength();
        const isSlide = slideAngle > Math.PI / 8 && this.moveStates.isFall;

        const fallSpeedWithFriction = fallSpeed * this.physics.friction;

        const { flags } = this.movesOptions;

        if (vel.getLength() > this.jumpVectors.backflip.getLength() * this.fallToJumpCoef) {
            this.moveStates.isFall = true;
        } else {
            this.moveStates.isFall = false;
        }
        this.moveStates.isJump = false;

        if (isSlide && !flags.left && !flags.right) {
            let friction = 0.95;

            if (!this.moveStates.isSlide) {
                friction = 0.45;
            }
            this.moveStates.isSlide = true;

            const slideSurface = normalSurface.clone();
            Vector2.rotate(slideSurface, Math.PI / 2);
            if (vel.dotProduct(slideSurface) < 0) {
                slideSurface.scale(-1);
            }
            if (slideSurface.y < 0) {
                slideSurface.y *= 2;
            }

            const speed = vel.getLength() * friction;
            const slideVec = slideSurface.clone().normalize();
            slideVec.scale(speed);
            this.physics.velocity = slideVec;
        } else {
            this.moveStates.isSlide = false;
            const dot = vel.dotProduct(normalSurface);

            const reflectionX = vel.x - 2 * dot * normalSurface.x;
            const reflectionY = vel.y - 2 * dot * normalSurface.y;
            const reflectedVector = new Vector2(reflectionX, reflectionY);
            this.physics.velocity = reflectedVector.normalize().scale(fallSpeedWithFriction);
        }
    }

    public acceptExplosion(mapMatrix: MapMatrix, entities: Entity[], options: IExplosionOptions) {
        super.acceptExplosion(mapMatrix, entities, options);
        this.lastDamageTimestamp = Date.now();
        this.moveStates.isDamaged = true;
    }

    protected move(mapMatrix: MapMatrix, entities: Entity[]) {
        this.moveStates.isMove = false;
        if (this.moveStates.isFall || this.moveStates.isJump || this.moveStates.isSlide || this.moveStates.isDamaged) {
            return;
        }

        const { flags } = this.movesOptions;
        if (!flags.left && !flags.right) {
            return;
        }

        this.moveStates.isMove = true;

        // direction for worm jump and sprite
        if (flags.left && !flags.right) {
            this.movesOptions.direction = -1;
        }
        if (flags.right && !flags.left) {
            this.movesOptions.direction = 1;
        }

        const { a, v, direction, speed, maxAngle } = this.movesOptions;
        a.x += direction;

        v.add(a).normalize().scale(speed);

        a.scale(0);

        const collision = this.checkCollision(mapMatrix, entities, v);
        if (!collision) {
            this.position.x += v.x;
            this.position.y += v.y;
            v.scale(0);
            return;
        }

        const newVec = collision.normalize().scale(-1);
        newVec
            .add(v.normalize())
            .normalize()
            .scale(speed * 2);

        const PIhalf = Math.PI / 2;
        const stepAngle = PIhalf - Math.abs(PIhalf - Math.atan2(newVec.y, newVec.x));
        if ((stepAngle * 180) / Math.PI < maxAngle) {
            this.movesOptions.a = newVec;
        }
        v.scale(0);
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number): void {
        this.move(mapMatrix, entities);
        super.update(mapMatrix, entities, wind);

        if (this.isSelected) {
            this.aim.update(this.moveStates, this.currentWeapon, this.radius, this.movesOptions.direction);
        } else {
            this.aim.toggle(false);
        }

        // temporary
        {
            if (this.moveStates.isDamaged) {
                const now = Date.now();
                const delta = now - this.lastDamageTimestamp;

                if (delta > 2500) {
                    this.moveStates.isDamaged = false;
                }
            }
            //test
            const material = this.wormMesh.material;
            if (material instanceof MeshBasicMaterial) {
                material.color.set(new Color(0xc48647));

                if (this.moveStates.isDamaged) {
                    material.color.set(new Color(0x00ffff));
                }

                if (this.moveStates.isFall) {
                    material.color.set(new Color(0xff00ff));
                }

                if (this.moveStates.isSlide) {
                    material.color.set(new Color(0xff0000));
                }
                if (this.moveStates.isMove) {
                    material.color.set(new Color(0xffff00));
                }

                if (this.moveStates.isJump) {
                    material.color.set(new Color(0x00ff00));
                }
            }
        }
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        // here we can remove hp for fall damage
        const delta = this.physics.velocity.getLength() - this.jumpVectors.backflip.getLength() * this.fallToJumpCoef;
        if (delta > 0) {
            // console.log(delta);
        }
        return;
    }

    public push(vec: Vector2) {
        this.moveStates.isFall = true;
        super.push(vec);
    }
}
