import { EBullets, ESoundsBullet } from '../../../../../../../../../../ts/enums';
import { IExplosionOptions } from '../../../../../../../../../../ts/interfaces';
import { Point2 } from '../../../../../../../../../utils/geometry';
import SoundManager from '../../../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../Entity';
import Worm from '../../../../Worm';
import BDynamite from './dynamite/BDynamite';

export default class BWormFinalExplosion extends BDynamite {
    public type: EBullets;
    private worm: Worm;
    private isExplodedState = false;
    collisionSound = ESoundsBullet.grenadeCollision;
    constructor(worm: Worm) {
        super({ angle: 1, parentRadius: 1, position: new Point2(0, 0), power: 0 });
        this.worm = worm;
        this.setExplosionOptions(95, 200, 15);
        this.bulletMesh.visible = false;
        this.type = EBullets.BDynamite;
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[]): void {
        this.position = this.worm.position.clone();
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
            if (entity != this && entity != this.worm) {
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
