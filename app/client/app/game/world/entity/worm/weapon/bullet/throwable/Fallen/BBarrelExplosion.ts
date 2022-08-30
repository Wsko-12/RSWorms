import { ESoundsBullet } from '../../../../../../../../../../ts/enums';
import { IExplosionOptions } from '../../../../../../../../../../ts/interfaces';
import { Point2 } from '../../../../../../../../../utils/geometry';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../Entity';
import Barrel from '../../../../../fallenItem/barrel/Barrel';
import BDynamite from './dynamite/BDynamite';

export default class BBarrelExplosion extends BDynamite {
    private barrel: Barrel;
    private isExplodedState = false;
    constructor(barrel: Barrel) {
        super({ angle: 1, parentRadius: 1, position: new Point2(0, 0), power: 0 });
        this.barrel = barrel;
        this.setExplosionOptions(95, 250, 25);
        this.bulletMesh.visible = false;
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[]): void {
        this.position = this.barrel.position.clone();
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
            if (entity != this && entity != this.barrel) {
                const dist = this.position.getDistanceToPoint(entity.position);
                if (explosionOptions.radius >= dist - entity.radius) {
                    entity.acceptExplosion(mapMatrix, entities, explosionOptions);
                }
            }
        });

        this.object3D.remove(this.bulletMesh);

        this.playExplosionAnimation().then(() => {
            setTimeout(() => {
                this.isExplodedState = true;
            }, 1000);
            this.remove();
        });
    }

    public isExploded() {
        return this.isExplodedState;
    }

    public update(): void {
        return;
    }
}
