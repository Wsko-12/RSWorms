import { Point2, Vector2 } from '../../../../utils/geometry';
import Bullet from './Bullet';

export default class Weapon {
    bullet!: Bullet;
    shoot({ angle, power, position }: { angle: number; power: number; position: Point2 }) {
        this.bullet = new Bullet(Math.random().toString(), position);
        console.log(new Vector2().setAngle(angle).scale(power / 5));
        this.bullet.push(
            new Vector2()
                .setAngle(angle)
                .normalize()
                .scale(power / 5)
        );
        return this.bullet;
    }
}
