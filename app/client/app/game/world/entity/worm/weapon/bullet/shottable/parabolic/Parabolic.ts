import MapMatrix from '../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../Entity';
import ShottableBullet from '../Shottable';

export default abstract class ParabolicBullet extends ShottableBullet {
    public update(mapMatrix: MapMatrix, entities: Entity[], wind: number, waterLevel: number): void {
        this.physics.velocity.x += wind * this.windCoefficient;
        super.update(mapMatrix, entities, wind, waterLevel);
    }
}
