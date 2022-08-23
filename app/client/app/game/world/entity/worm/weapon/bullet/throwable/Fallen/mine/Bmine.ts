import { EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../../ts/types';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import Worm from '../../../../../Worm';
import FallenBullet from '../Fallen';

export default class BMine extends FallenBullet {
    actuationRadius = 100;
    start: number;
    isActiveState = false;
    constructor(removeEntityCallback: TRemoveEntityCallback, id: string, options: IBulletOptions) {
        super(removeEntityCallback, id, options, EWeapons.mine);
        this.start = Date.now();
    }

    isSomeoneHere(entities: Entity[], mapMatrix: MapMatrix) {
        entities.forEach((entity) => {
            if (entity != this && entity instanceof Worm) {
                const dist = this.position.getDistanceToPoint(entity.position);
                if (dist <= this.actuationRadius) {
                    setTimeout(() => this.explode(mapMatrix, entities), 5000);
                }
            }
        });
    }

    protected activate(mapMatrix: MapMatrix, entities: Entity[]) {
        this.isActivated = true;
    }

    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number): void {
        super.update(mapMatrix, entities, wind);
        if (this.isActivated) {
            this.isSomeoneHere(entities, mapMatrix);
        }
    }

    public updateObjectRotation() {
        const { x, y } = this.physics.velocity;
        const angle = Math.atan2(y, x);
        this.object3D.rotation.z = angle;
    }
}
