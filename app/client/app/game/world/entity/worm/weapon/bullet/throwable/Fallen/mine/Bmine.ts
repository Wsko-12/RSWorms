import { ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import SoundManager from '../../../../../../../../../soundManager/SoundManager';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import Worm from '../../../../../Worm';
import FallenBullet from '../Fallen';

export default class BMine extends FallenBullet {
    private actuationRadius = 100;
    private start: number;
    private isDetonated = false;
    collisionSound = ESoundsBullet.mineCollision;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.mine);
        this.start = Date.now();
        this.setExplosionOptions(50, 200, 15);
    }

    private isWormClose(mapMatrix: MapMatrix, entities: Entity[]) {
        return entities.some(
            (entity) =>
                entity instanceof Worm && this.position.getDistanceToPoint(entity.position) <= this.actuationRadius
        );
    }

    private detonate(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number) {
        this.isDetonated = true;
        SoundManager.playBullet(ESoundsBullet.mineArm);
        setTimeout(() => this.explode(mapMatrix, entities, waterLevel), 5000);
    }

    protected activate() {
        return;
    }

    public betweenTurnsActions(): Promise<boolean> {
        this.isActivated = true;
        return Promise.resolve(true);
    }

    public readyToNextTurn() {
        return this.isActivated && !this.isDetonated;
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number): void {
        super.update(mapMatrix, entities, wind, waterLevel);
        if (this.isActivated && this.isWormClose(mapMatrix, entities) && !this.isDetonated) {
            this.detonate(mapMatrix, entities, waterLevel);
        }
    }

    public updateObjectRotation() {
        const { x, y } = this.physics.velocity;
        const angle = Math.atan2(y, x);
        this.object3D.rotation.z = angle;
    }
}
