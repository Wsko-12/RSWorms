import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import { ELang, ELayersZ, ESizes, ESoundsWormAction, ESoundsWormSpeech, EWeapons } from '../../../../../../ts/enums';
import { IExplosionOptions, IShootOptions, IWormMoveOptions, IWormMoveStates } from '../../../../../../ts/interfaces';
import { TEndTurnCallback, TLoopCallback, TRemoveEntityCallback } from '../../../../../../ts/types';
import { Point2, Vector2 } from '../../../../../utils/geometry';
import SoundManager from '../../../soundManager/SoundManager';
import MapMatrix from '../../worldMap/mapMatrix/MapMatrix';
import Entity from '../Entity';
import BWormFinalExplosion from './weapon/bullet/throwable/Fallen/BWormFinalExplosion';
import WBazooka from './weapon/weapon/powerable/bazooka/Bazooka';
import WGrenade from './weapon/weapon/powerable/grenade/Grenade';
import WDynamite from './weapon/weapon/static/dynamite/Dynamite';
import WMine from './weapon/weapon/static/mine/Mine';
import Weapon from './weapon/weapon/Weapon';
import WormAnimation from './WormAnimation';
import WormGui from './WormGui';

export default class Worm extends Entity {
    protected object3D: Group;
    private wormMesh: Mesh;
    private fallToJumpCoef = 1.2;
    private animation = new WormAnimation();
    private gui: WormGui;
    private index: number;
    private team: number;
    private name: string;

    private endTurnCallback: TEndTurnCallback | null = null;

    private currentWeapon: null | Weapon = null;

    private weaponPack: Record<EWeapons, Weapon> = {
        bazooka: new WBazooka(),
        grenade: new WGrenade(),
        dynamite: new WDynamite(),
        mine: new WMine(),
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
        isCelebrated: false,
        isDrown: false,
        isDead: false,
    };

    private finalExplosion = new BWormFinalExplosion(this);

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
    private maxHp: number;

    constructor(wormIndex: number, teamIndex: number, x = 0, y = 0, hp = 100) {
        super(ESizes.worm, x, y);
        this.index = wormIndex;
        this.team = teamIndex;
        this.name = 'Worm_' + wormIndex;
        this.physics.friction = 0.1;
        const geometry = new PlaneBufferGeometry(this.radius * 5, this.radius * 5);
        const material = new MeshBasicMaterial({
            map: this.animation.getTexture(),
            alphaTest: 0.5,
        });
        this.object3D = new Group();
        this.wormMesh = new Mesh(geometry, material);
        this.gui = new WormGui(this.name, teamIndex);
        this.gui.setActualHp(hp);

        this.object3D.add(this.wormMesh, this.gui.getObject3D(), this.finalExplosion.getObject3D());
        this.object3D.position.set(x, y, ELayersZ.worms);
        this.hp = hp;
        this.maxHp = hp;
    }

    public setAsSelected(flag: boolean) {
        this.isSelected = flag;

        this.movesOptions.flags.left = false;
        this.movesOptions.flags.right = false;
    }

    public setMoveFlags(flags: { left?: boolean; right?: boolean }) {
        Object.assign(this.movesOptions.flags, flags);
    }

    public getHPLevel() {
        return this.hp / this.maxHp;
    }

    public getHP() {
        return this.hp;
    }

    public setHP(hp: number) {
        this.hp += Math.round(hp);
        if (this.hp < 0) {
            this.hp = 0;
        }
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
        if (this.endTurnCallback) {
            this.endTurnCallback(5);
        }
        return this.currentWeapon.shoot(options);
    }

    public celebrate() {
        this.moveStates.isCelebrated = true;
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

    public startTurn(nextTurnCallback: TEndTurnCallback) {
        this.endTurnCallback = nextTurnCallback;
    }

    public endTurn() {
        this.endTurnCallback = null;
    }

    public betweenTurnsActions(): Promise<boolean> {
        if (this.isStable()) {
            this.gui.setActualHp(this.getHP());
        }
        return Promise.resolve(true);
    }

    public readyToNextTurn() {
        if (this.gui.isUpdated(this.getHP())) {
            if (!this.gui.isDead()) {
                return this.isStable();
            } else {
                if (this.isStable()) {
                    this.animation.playDeadAnimation();
                    return this.finalExplosion.isExploded();
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    protected gravity(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number) {
        const vel = this.physics.velocity.clone();
        if (this.position.y + this.radius < waterLevel) {
            this.moveStates.isDrown = true;
        } else {
            vel.y -= this.physics.g;
        }

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
        if (!collision || this.moveStates.isDrown) {
            if (vel.getLength() > this.jumpVectors.backflip.getLength() * this.fallToJumpCoef) {
                this.moveStates.isFall = true;
                this.moveStates.isJump = false;
            }
            if (this.moveStates.isDrown) {
                this.moveStates.isDrown = true;
                this.position.y -= this.physics.g * 5;
            } else {
                this.position.x += vel.x;
                this.position.y += vel.y;
                this.physics.velocity = vel;
            }

            return;
        }

        this.handleCollision(mapMatrix, entities);

        const normalSurface = collision.normalize().scale(-1);
        const velClone = vel.clone().normalize().scale(-1);
        const slideAngle = Math.PI / 2 - Math.acos(normalSurface.dotProduct(velClone));
        const fallSpeed = vel.getLength();
        const isSlide = slideAngle > Math.PI / 8 && this.moveStates.isFall;
        if (isSlide) SoundManager.playWormSpeech(ELang.rus, ESoundsWormSpeech.oof1);
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

    protected checkCollision(
        mapMatrix: MapMatrix,
        entities: Entity[],
        vec: Vector2,
        radAngleShift = this.radiusUnitAngle
    ) {
        const { matrix } = mapMatrix;
        let responseX = 0;
        let responseY = 0;

        let collision = false;

        const potentialX = this.position.x + vec.x;
        const potentialY = this.position.y + vec.y;
        const vecAngle = Math.atan2(vec.y, vec.x);
        const PIhalf = Math.PI / 2;

        const startAngle = vecAngle - PIhalf + radAngleShift;
        const endAngle = vecAngle + PIhalf - radAngleShift;

        for (let ang = startAngle; ang < endAngle; ang += this.radiusUnitAngle) {
            const x = this.radius * Math.cos(ang) + potentialX;
            const y = this.radius * Math.sin(ang) + potentialY;
            const point = new Point2(x, y);

            entities.forEach((entity) => {
                if (entity != this) {
                    const dist = point.getDistanceToPoint(entity.position);
                    if (dist <= entity.radius) {
                        const dY = y - this.position.y;
                        if (dY < 0) {
                            collision = true;
                            responseX += x - this.position.x;
                            responseY += y - this.position.y;
                        }
                    }
                }
            });

            const iX = Math.floor(x);
            const iY = Math.floor(y);

            if (iX < 0) {
                return null;
            }
            if (iX >= matrix[0].length) {
                return null;
            }

            if (iY < 0) {
                return null;
            }
            if (iY >= matrix.length) {
                return null;
            }

            if (matrix[iY] && matrix[iY][iX] && matrix[iY][iX] !== 0) {
                responseX += x - this.position.x;
                responseY += y - this.position.y;
                collision = true;
            }
        }

        return collision ? new Vector2(responseX, responseY) : null;
    }

    public acceptExplosion(mapMatrix: MapMatrix, entities: Entity[], options: IExplosionOptions) {
        const force = super.acceptExplosion(mapMatrix, entities, options);
        if (this.endTurnCallback) {
            this.endTurnCallback(0.5);
        }
        this.lastDamageTimestamp = Date.now();
        this.moveStates.isDamaged = true;
        const damage = force * options.damage;
        this.setHP(damage * -1);
        return force;
    }

    protected move(mapMatrix: MapMatrix, entities: Entity[]) {
        this.moveStates.isMove = false;
        if (
            this.moveStates.isFall ||
            this.moveStates.isJump ||
            this.moveStates.isSlide ||
            this.moveStates.isDamaged ||
            this.moveStates.isDrown
        ) {
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

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number): void {
        this.move(mapMatrix, entities);
        super.update(mapMatrix, entities, wind, waterLevel);
        this.object3D.position.z = ELayersZ.worms;

        this.currentWeapon?.show(this.isSelected && this.isStable());
        this.currentWeapon?.update(this.movesOptions.direction);

        if (this.gui.isDead() && this.animation.dead.isReady && !this.moveStates.isDead) {
            this.moveStates.isDead = true;
            this.finalExplosion.explode(mapMatrix, entities);
        }

        if (this.position.y < 0) {
            this.setHP(-this.getHP());
            SoundManager.playWormAction(ESoundsWormAction.splash);
            this.moveStates.isDead = true;
            if (this.endTurnCallback) {
                this.endTurnCallback(5);
            }
            this.remove();
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
        }
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        // here we can remove hp for fall damage
        const delta = this.physics.velocity.getLength() - this.jumpVectors.backflip.getLength() * this.fallToJumpCoef;
        if (delta > 0) {
            const damage = delta ** 2;
            this.setHP(delta * -1);
            if (this.endTurnCallback) {
                this.endTurnCallback(0);
            }
        }
        return;
    }

    public push(vec: Vector2) {
        this.moveStates.isFall = true;
        super.push(vec);
    }

    public isDead() {
        return this.moveStates.isDead;
    }

    public spriteLoop: TLoopCallback = (time) => {
        this.animation.spriteLoop(
            this.moveStates,
            this.movesOptions.direction,
            this.isSelected ? this.currentWeapon?.getRawAngle() : undefined
        );

        if (this.moveStates.isDead) {
            this.gui.show(false);
        } else {
            this.gui.spriteLoop();
        }
    };
}
