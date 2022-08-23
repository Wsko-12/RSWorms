import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import { ELayersZ, ESizes, EWeapons } from '../../../../../../ts/enums';
import { IExplosionOptions, IShootOptions, IWormMoveOptions, IWormMoveStates } from '../../../../../../ts/interfaces';
import { TLoopCallback, TRemoveEntityCallback } from '../../../../../../ts/types';
import { Vector2 } from '../../../../../utils/geometry';
import MapMatrix from '../../worldMap/mapMatrix/MapMatrix';
import Entity from '../Entity';
import Weapon from './weapon/weapon/Weapon';
import WormAnimation from './WormAnimation';

export default class Worm extends Entity {
    protected object3D: Group;
    private wormMesh: Mesh;
    private fallToJumpCoef = 1.2;
    private animation = new WormAnimation();

    private currentWeapon: null | Weapon = null;

    private weaponPack: Record<EWeapons, Weapon> = {
        bazooka: new Weapon(EWeapons.bazooka),
    };

    public isSelected = false;
    private jumpVectors = {
        usual: new Vector2(1, 1).normalize().scale(5),
        backflip: new Vector2(0.2, 1).normalize().scale(8),
    };

    // for animations
    public moveStates: IWormMoveStates = {
        isSlide: false,
        isMove: false,
        isJump: false,
        isDoubleJump: false,
        isFall: true,
        isDamaged: false,
    };

    //temporary
    private lastDamageTimestamp = 0;

    public movesOptions: IWormMoveOptions = {
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

    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, x = 0, y = 0, hp = 100) {
        super(removeEntityCallback, id, ESizes.worm, x, y);
        this.id = id;
        this.physics.friction = 0.1;
        const geometry = new PlaneBufferGeometry(this.radius * 5, this.radius * 5);
        const material = new MeshBasicMaterial({
            map: this.animation.getTexture(),
            alphaTest: 0.5,
        });
        this.object3D = new Group();
        this.wormMesh = new Mesh(geometry, material);

        this.object3D.add(this.wormMesh);
        this.object3D.position.set(x, y, ELayersZ.worms);
        this.hp = hp;
    }

    public setAsSelected(flag: boolean) {
        this.isSelected = flag;
    }

    public setMoveFlags(flags: { left?: boolean; right?: boolean }) {
        this.stable = false;
        Object.assign(this.movesOptions.flags, flags);
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
        this.moveStates.isDoubleJump = !!double;
        this.push(vec);
    }

    public shoot() {
        if (!this.currentWeapon) return;
        const options: IShootOptions = {
            position: this.position.clone(),
            parentRadius: this.radius,
            wormDirection: this.movesOptions.direction,
        };
        return this.currentWeapon.shoot(options, this.removeEntityCallback);
    }
    public selectWeapon(weapon: EWeapons | null) {
        const before = this.currentWeapon;
        if (before) {
            const object = before.getObject3D();
            before.show(false, 0);
            this.object3D.remove(object);
        }

        if (!weapon) {
            this.currentWeapon = null;
            return;
        }
        this.currentWeapon = this.weaponPack[weapon];

        const after = this.currentWeapon;
        if (after) {
            const object = after.getObject3D();
            this.object3D.add(object);
            after.show(true);
        }
    }

    public changeAim(direction: 1 | -1 | 0, speed: number, power: boolean) {
        this.currentWeapon?.changeAim(direction, speed, power);
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
        this.moveStates.isDoubleJump = false;

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
            this.movesOptions.direction = slideVec.x > 0 ? 1 : -1;

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

    public isStable() {
        return (
            !this.moveStates.isFall && !this.moveStates.isJump && !this.moveStates.isMove && !this.moveStates.isSlide
        );
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number): void {
        this.move(mapMatrix, entities);
        super.update(mapMatrix, entities, wind);
        this.object3D.position.z = ELayersZ.worms;

        this.currentWeapon?.show(this.isSelected && this.isStable());
        this.currentWeapon?.update(this.movesOptions.direction);

        // temporary
        {
            if (this.moveStates.isDamaged) {
                const now = Date.now();
                const delta = now - this.lastDamageTimestamp;

                if (delta > 2500) {
                    this.moveStates.isDamaged = false;
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

    public spriteLoop: TLoopCallback = (time) => {
        this.animation.spriteLoop(this.moveStates, this.movesOptions.direction, undefined);
    };
}
