import MapMatrix from '../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../Entity';
import Bullet from '../Bullet';

export default abstract class ShottableBullet extends Bullet {
    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        this.explode(mapMatrix, entities, waterLevel);
    }
}
