import {
    CircleBufferGeometry,
    Color,
    Group,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneBufferGeometry,
    Texture,
} from 'three';
import { ELayersZ } from '../../../../../../ts/enums';
import { IExplosionOptions, IShootOptions } from '../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../ts/types';
import { Vector2 } from '../../../../../utils/geometry';
import MapMatrix from '../../worldMap/mapMatrix/MapMatrix';
import Entity from '../Entity';
import Weapon from './weapon/Weapon';

export default class Worm extends Entity {
    protected object3D: Group;
    protected wormMesh: Mesh;
    protected aimMesh: Mesh;
    protected shootPowerMesh: Mesh;
    protected shootPowerCanvas = document.createElement('canvas');
    protected shootPowerCtx = this.shootPowerCanvas.getContext('2d');

    public isSelected = false;
    private jumpVectors = {
        usual: new Vector2(1, 1).normalize().scale(5),
        backflip: new Vector2(0.2, 1).normalize().scale(8),
    };

    // for animations
    private moveStates = {
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
    private aimAngle = 0;
    private power = 0;
    private deltaPower = 0.1;
    private currentWeapon: Weapon;

    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, x = 0, y = 0, hp = 100) {
        super(removeEntityCallback, id, 20, x, y);
        this.currentWeapon = new Weapon();
        this.id = id;
        this.physics.friction = 0.1;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xc48647, transparent: true, opacity: 0.5 });
        this.object3D = new Group();
        this.wormMesh = new Mesh(geometry, material);
        this.aimMesh = new Mesh(new PlaneBufferGeometry(10, 10), new MeshBasicMaterial());
        const shootingPowerTexture = new Texture(this.shootPowerCanvas);
        this.shootPowerMesh = new Mesh(
            new PlaneBufferGeometry(1, 1),
            new MeshBasicMaterial({
                map: shootingPowerTexture,
                alphaTest: 0.5,
            })
        );

        this.shootPowerMesh.position.set(0, 0, ELayersZ.aim);

        this.shootPowerCanvas.width = 256;
        this.shootPowerCanvas.height = 256;

        this.object3D.add(this.wormMesh, this.aimMesh, this.shootPowerMesh);
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

    public changePower() {
        // y = x**2
        this.deltaPower += 0.25;
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

    private setupAimMeshes() {
        if (!this.isSelected || !this.currentWeapon) {
            this.aimMesh.visible = false;
            this.shootPowerMesh.visible = false;
            return;
        }
        if (this.moveStates.isFall || this.moveStates.isSlide || this.moveStates.isJump || this.moveStates.isMove) {
            this.aimMesh.visible = false;
            this.shootPowerMesh.visible = false;
            return;
        }

        this.aimMesh.visible = true;
        this.shootPowerMesh.visible = true;

        const r = this.currentWeapon.aimRadius;
        const rad = this.getAimAngle() * (Math.PI / 180);
        const x = Math.cos(rad) * r;
        const y = Math.sin(rad) * r;
        this.shootPowerMesh.rotation.z = rad;
        this.aimMesh.position.set(x, y, ELayersZ.aim);
        this.shootPowerMesh.scale.set(this.radius * 2 + r * 1.5, this.radius * 2 + r * 1.5, 1);
        this.drawShootPower();
    }

    public drawShootPower() {
        const ctx = this.shootPowerCtx;
        if (ctx) {
            if (this.power) {
                for (let i = 0; i < this.power; i += 5) {
                    let green = 255;
                    let red = 0;
                    if (i < 50) {
                        red += 255 * (i / 50);
                    } else {
                        red = 255;
                        green -= 255 * ((i - 50) / 50);
                    }
                    ctx.fillStyle = `rgb(${red},${green},0)`;
                    // ctx.fillStyle = `rgb(255, 255, 0)`;
                    const radius = 128 * (i * 0.0015);
                    ctx.beginPath();
                    ctx.arc(128 + (128 * (i / 100) - radius), 128, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                ctx.clearRect(0, 0, 256, 256);
            }
        }

        if (this.shootPowerMesh.material instanceof MeshBasicMaterial) {
            const texture = this.shootPowerMesh.material.map;
            if (texture) {
                texture.needsUpdate = true;
            }
        }
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
            if (vel.getLength() > this.jumpVectors.backflip.getLength() * 1.5) {
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
        const isSlide = slideAngle < Math.PI / 3 && this.moveStates.isFall;

        const fallSpeedWithFriction = fallSpeed * this.physics.friction;

        const { flags } = this.movesOptions;

        if (vel.getLength() > this.jumpVectors.backflip.getLength() * 1.2) {
            this.moveStates.isFall = true;
        } else {
            this.moveStates.isFall = false;
        }
        this.moveStates.isJump = false;

        if (isSlide && !flags.left && !flags.right) {
            this.moveStates.isSlide = true;
            const friction = 0.9;
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
        //mapMatrix and entities needs for example for barrels we create method explode
        const vec = new Vector2(this.position.x - options.point.x, this.position.y - options.point.y);

        const dist = vec.getLength() - this.radius;

        const force = (options.radius - dist) / options.radius;
        if (force <= 0) {
            return;
        }
        vec.y = Math.abs(vec.y);

        vec.normalize().scale(force * options.kickForce);

        this.lastDamageTimestamp = Date.now();
        this.moveStates.isDamaged = true;
        this.push(vec);
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
        this.gravity(mapMatrix, entities, wind);
        this.move(mapMatrix, entities);
        this.object3D.position.set(this.position.x, this.position.y, ELayersZ.worms);

        // temporary
        if (this.moveStates.isDamaged) {
            const now = Date.now();
            const delta = now - this.lastDamageTimestamp;

            if (delta > 2500) {
                this.moveStates.isDamaged = false;
            }
        }

        this.setupAimMeshes();
        //test
        {
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

    public push(vec: Vector2) {
        this.moveStates.isFall = true;
        const { velocity } = this.physics;
        velocity.x += vec.x;
        velocity.y += vec.y;
    }
}
