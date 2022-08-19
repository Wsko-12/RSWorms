import { Point2, Vector2 } from '../../../../../../utils/geometry';
import Bullet from './bullet/Bullet';

export default class Weapon {
    shoot({ angle, power, position }: { angle: number; power: number; position: Point2 }) {
        angle = (angle / 180) * Math.PI;
        const shootVector = new Vector2();
        Vector2.rotate(shootVector, angle);
        const bullet = new Bullet(Math.random().toString(), position);
        bullet.push(shootVector.normalize().scale(power / 5));
        return bullet;
    }
}
