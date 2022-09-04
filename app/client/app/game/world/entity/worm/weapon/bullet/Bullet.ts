import { ESoundsBullet } from '../../../../../../../../ts/enums';
import { Group, Mesh, MeshBasicMaterial, NearestFilter, Object3D, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ, EWeapons } from '../../../../../../../../ts/enums';
import { IBulletOptions, IExplosionOptions } from '../../../../../../../../ts/interfaces';
import { Vector2 } from '../../../../../../../utils/geometry';
import AssetsManager from '../../../../../assetsManager/AssetsManager';
import SoundManager from '../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    protected bulletMesh: Mesh;
    private texture: Texture;
    protected windCoefficient = 1;
    public name: EWeapons;
    protected isRemoved = false;

    private explosionAnimation: {
        texture: Texture;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        mesh: Mesh;
        step: number;
        image: HTMLImageElement;
        maxSteps: number;
    };

    private startOptions: IBulletOptions;

    protected explosion = {
        damage: 150,
        radius: 150,
        kick: 15,
    };

    constructor(options: IBulletOptions, textureName: EWeapons) {
        let { angle } = options;
        const { power, position } = options;
        angle = (angle / 180) * Math.PI;
        super('bullet', 10, position.x, position.y);
        this.startOptions = options;

        this.position.x += Math.cos(angle) * (options.parentRadius + this.radius + 1);
        this.position.y += Math.sin(angle) * (options.parentRadius + this.radius + 1);

        this.physics.friction = 0.05;

        if (!textureName) {
            throw new Error(`[Weapon] no provided texture name`);
        }

        this.name = textureName;

        const geometry = new PlaneBufferGeometry(100, 100);
        const image = AssetsManager.getBulletTexture(textureName);
        if (!image) {
            throw new Error(`[Weapon] can't load texture: ${textureName}`);
        }
        const texture = new Texture(image);
        texture.needsUpdate = true;
        texture.magFilter = NearestFilter;
        this.texture = texture;
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        this.object3D = new Group();
        this.bulletMesh = new Mesh(geometry, material);
        this.object3D.add(this.bulletMesh);
        this.object3D.position.z = 0;

        this.explosionAnimation = this.createExplosionMesh();

        const shootVector = new Vector2();
        Vector2.rotate(shootVector, angle);
        this.push(shootVector.normalize().scale(power / 5));
    }

    public getStartBulletOptions() {
        return this.startOptions;
    }

    private createExplosionMesh() {
        const canvas = document.createElement('canvas');
        const image = AssetsManager.getEffectTexture('explosion');

        if (!image) {
            throw new Error(`[Bullet createExplosionMesh] can't load texture`);
        }

        const maxSteps = image.naturalHeight / image.naturalWidth;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalWidth;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error(`[Bullet createExplosionMesh] can't get canvas ctx`);
        }

        const texture = new Texture(canvas);
        texture.needsUpdate = true;
        const geometry = new PlaneBufferGeometry(1, 1);
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.z = ELayersZ.bullets + 10;
        mesh.scale.x = this.explosion.radius;
        mesh.scale.y = this.explosion.radius;

        return {
            texture,
            image,
            ctx,
            canvas,
            mesh,
            step: 0,
            maxSteps,
        };
    }

    protected setExplosionOptions(damage: number, radius: number, kick: number) {
        this.explosionAnimation.mesh.scale.x = radius;
        this.explosionAnimation.mesh.scale.y = radius;
        this.explosion.damage = damage;
        this.explosion.radius = radius;
        this.explosion.kick = kick;
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        return;
    }

    protected playExplosionAnimation() {
        this.object3D.add(this.explosionAnimation.mesh);
        return new Promise((res) => {
            const play = () => {
                const { ctx, image, step, texture, maxSteps } = this.explosionAnimation;
                const size = image.naturalWidth;

                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(image, 0, -size * step);
                texture.needsUpdate = true;

                this.explosionAnimation.step++;
                if (this.explosionAnimation.step <= maxSteps) {
                    setTimeout(play, 80);
                } else {
                    res(true);
                }
            };
            play();
        });
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number) {
        if (this.position.y < waterLevel) {
            this.setExplosionOptions(0, 10, 0);
            this.playExplosionAnimation().then(() => {
                this.remove();
            });
        }
        this.isRemoved = true;
        SoundManager.playBullet(ESoundsBullet.explosion);
        mapMatrix.destroy(this.position, this.explosion.radius);
        const explosionOptions: IExplosionOptions = {
            damage: this.explosion.damage,
            point: this.position.clone(),
            radius: this.explosion.radius,
            kickForce: this.explosion.kick,
        };

        entities.forEach((entity) => {
            if (entity != this) {
                const dist = this.position.getDistanceToPoint(entity.position);
                if (explosionOptions.radius >= dist + entity.radius) {
                    entity.acceptExplosion(mapMatrix, entities, explosionOptions);
                }
            }
        });

        this.object3D.remove(this.bulletMesh);

        this.playExplosionAnimation().then(() => {
            this.remove();
        });
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number) {
        this.updateObjectRotation();
        if (!this.isRemoved) {
            super.update(mapMatrix, entities, wind, waterLevel);
        }
        this.object3D.position.z = ELayersZ.bullets;
    }

    public updateObjectRotation() {
        const { x, y } = this.physics.velocity;
        const angle = Math.atan2(y, x);
        this.object3D.rotation.z = angle;
    }
}
