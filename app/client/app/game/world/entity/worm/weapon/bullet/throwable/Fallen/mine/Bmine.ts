import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import Worm from '../../../../../Worm';
import FallenBullet from '../Fallen';

export default class BMine extends FallenBullet {
    private actuationRadius = 100;
    private start: number;
    private isDetonated = false;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.mine);
        this.start = Date.now();
    }

    private isWormClose(mapMatrix: MapMatrix, entities: Entity[]) {
        return entities.some(
            (entity) =>
                entity instanceof Worm && this.position.getDistanceToPoint(entity.position) <= this.actuationRadius
        );
    }

    private detonate(mapMatrix: MapMatrix, entities: Entity[]) {
        this.isDetonated = true;
        setTimeout(() => this.explode(mapMatrix, entities), 5000);
    }

    protected activate() {
        this.isActivated = true;
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number): void {
        super.update(mapMatrix, entities, wind);
        if (this.isActivated && this.isWormClose(mapMatrix, entities) && !this.isDetonated) {
            this.detonate(mapMatrix, entities);
        }
    }

    public updateObjectRotation() {
        const { x, y } = this.physics.velocity;
        const angle = Math.atan2(y, x);
        this.object3D.rotation.z = angle;
    }
}
