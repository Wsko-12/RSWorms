import { Mesh, MeshBasicMaterial, Object3D, PlaneBufferGeometry, Texture } from 'three/src/Three';
import { IExplosionOptions, IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import AssetsManager from '../../../../../assetsManager/AssetsManager';
import SoundManager from '../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    private texture: Texture;
    protected rotationCoef = 1;
    protected explosionRadius = 150;
    private windCoefficient = 0;
    private kickForce = 25;
    // how many hp will be removed if it explodes close to the worm
    protected explosionDamage = 50;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions, textureName?: string) {
        let { angle } = options;
        const { power, position, parentRadius } = options;
        angle = (angle / 180) * Math.PI;
        super(removeEntityCallback, id, 10, position.x, position.y);

        this.position.x += Math.cos(angle) * (parentRadius + this.radius + 1);
        this.position.y += Math.sin(angle) * (parentRadius + this.radius + 1);

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
        mapMatrix.destroy(this.position, this.explosionRadius);
        const explosionOptions: IExplosionOptions = {
            damage: this.explosionDamage,
            point: this.position.clone(),
            radius: this.explosionRadius,
            kickForce: this.kickForce,
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
        if (this.rotationCoef === 0) {
            const { x, y } = this.physics.velocity;
            const angle = Math.atan2(y, x);
            this.object3D.rotation.z = angle;
        }else{
            const direction = this.physics.velocity.x > 0 ? -1 : 1;
            this.object3D.rotation.z += direction * this.rotationCoef * (this.physics.velocity.getLength() * 0.01);
        }
    }
}
