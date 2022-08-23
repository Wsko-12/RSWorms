import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, Texture } from 'three';
import { EWeapons } from '../../../../../../../../ts/enums';
import { IBulletOptions, IExplosionOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import AssetsManager from '../../../../../assetsManager/AssetsManager';
import SoundManager from '../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    private texture: Texture;
    protected windCoefficient = 1;

    private explosion = {
        damage: 150,
        radius: 150,
        kick: 15,
    };

    constructor(
        removeEntityCallback: TRemoveEntityCallback,
        id: string,
        options: IBulletOptions,
        textureName?: EWeapons
    ) {
        let { angle } = options;
        const { power, position } = options;
        angle = (angle / 180) * Math.PI;
        super(removeEntityCallback, id, 10, position.x, position.y);

        this.position.x += Math.cos(angle) * (options.parentRadius + this.radius + 1);
        this.position.y += Math.sin(angle) * (options.parentRadius + this.radius + 1);

        this.physics.friction = 0.05;

        if (!textureName) {
            throw new Error(`[Weapon] no provided texture name`);
        }
        const geometry = new PlaneBufferGeometry(100, 100);
        const image = AssetsManager.getBulletTexture(textureName);
        if (!image) {
            throw new Error(`[Weapon] can't load texture: ${textureName}`);
        }
        const texture = new Texture(image);
        texture.needsUpdate = true;
        this.texture = texture;
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        this.object3D = new Mesh(geometry, material);
        this.object3D.position.set(this.position.x, this.position.y, 0);

        const shootVector = new Vector2();
        Vector2.rotate(shootVector, angle);
        this.push(shootVector.normalize().scale(power / 5));
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[]): void {
        this.explode(mapMatrix, entities);
    }

    protected explode(mapMatrix: MapMatrix, entities: Entity[]) {
        SoundManager.playSFX('explosion');
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
                if (explosionOptions.radius >= dist - entity.radius) {
                    entity.acceptExplosion(mapMatrix, entities, explosionOptions);
                }
            }
        });
        this.remove();
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number) {
        this.physics.velocity.x += wind * this.windCoefficient;
        this.updateObjectRotation();
        super.update(mapMatrix, entities, wind);
    }

    public updateObjectRotation() {
        const { x, y } = this.physics.velocity;
        const angle = Math.atan2(y, x);
        this.object3D.rotation.z = angle;
        // if (this.rotationCoef === 0) {

        // } else {
        //     const direction = this.physics.velocity.x > 0 ? -1 : 1;
        //     this.object3D.rotation.z += direction * this.rotationCoef * (this.physics.velocity.getLength() * 0.01);
        // }
    }
}
