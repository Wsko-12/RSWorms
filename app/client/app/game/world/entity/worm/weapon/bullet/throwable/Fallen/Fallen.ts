import { EWeapons } from '../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../../../../ts/types';
import { Vector2 } from '../../../../../../../../../utils/geometry';
import MapMatrix from '../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../Entity';
import ThrowableBullet from '../Throwable';

export default abstract class FallenBullet extends ThrowableBullet {
    constructor(
        removeEntityCallback: TRemoveEntityCallback,
        id: string,
        options: IBulletOptions,
        textureName: EWeapons
    ) {
        options.power = 0;
        super(removeEntityCallback, id, options, textureName);
    }

    checkCollision(mapMatrix: MapMatrix, entities: Entity[], vec: Vector2, radAngleShift = this.radiusUnitAngle) {
        const { matrix } = mapMatrix;
        let responseX = 0;
        let responseY = 0;

        let collision = false;

        const potentialX = this.position.x + vec.x;
        const potentialY = this.position.y + vec.y;
        const vecAngle = Math.atan2(vec.y, vec.x);
        const PIhalf = Math.PI / 2;

        const startAngle = vecAngle - PIhalf + radAngleShift;
        const endAngle = vecAngle + PIhalf - radAngleShift;

        for (let ang = startAngle; ang < endAngle; ang += this.radiusUnitAngle) {
            const x = this.radius * Math.cos(ang) + potentialX;
            const y = this.radius * Math.sin(ang) + potentialY;

            const iX = Math.floor(x);
            const iY = Math.floor(y);

            if (iX < 0) {
                return null;
            }
            if (iX >= matrix[0].length) {
                return null;
            }

            if (iY < 0) {
                return null;
            }
            if (iY >= matrix.length) {
                return null;
            }

            if (matrix[iY] && matrix[iY][iX] && matrix[iY][iX] !== 0) {
                responseX += x - this.position.x;
                responseY += y - this.position.y;
                collision = true;
            }
        }
        return collision ? new Vector2(responseX, responseY) : null;
    }

    public updateObjectRotation() {
        return;
    }
}
