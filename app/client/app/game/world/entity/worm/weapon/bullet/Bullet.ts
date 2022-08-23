import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three/src/Three';
import { IExplosionOptions, IShootOptions } from '../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../utils/geometry';
import SoundManager from '../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../Entity';

export default class Bullet extends Entity {
    protected object3D: Object3D;
    protected explosionRadius = 150;
    private windCoefficient = 1;
    private kickForce = 25;
    // how many hp will be removed if it explodes close to the worm
    protected explosionDamage = 50;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IShootOptions) {
        let { angle } = options;
        const { power, position, parentRadius } = options;
        angle = (angle / 180) * Math.PI;
        super(removeEntityCallback, id, 10, position.x, position.y);

        this.position.x += Math.cos(angle) * (parentRadius + this.radius + 1);
        this.position.y += Math.sin(angle) * (parentRadius + this.radius + 1);

        this.physics.friction = 0.05;
        const geometry = new CircleBufferGeometry(this.radius, 120);
        const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
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
        super.update(mapMatrix, entities, wind);
    }
}
