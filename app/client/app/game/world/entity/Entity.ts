import { Point2, Vector2 } from '../../../../utils/geometry';
import { Moves, Physics } from './entityInterfaces';

export default class Entity {
    id: number;
    position: Point2;
    radius: number;
    radiusUnitAngle: number;
    stable: boolean;
    physics: Physics;
    moves: Moves;

    constructor(x: number, y: number, r: number) {
        this.id = Math.round(Math.random() * 100);
        this.position = new Point2(x, y);
        this.radius = r;
        this.radiusUnitAngle = Math.asin(0.5 / this.radius) * 2;

        this.stable = false;
        this.physics = {
            acceleration: new Vector2(0, 0),
            velocity: new Vector2(0, 0),
            g: 0.01,
            friction: 0.8,
        };
        this.moves = {
            a: new Vector2(0, 0),
            v: new Vector2(0, 0),
            direction: 0,
            speed: 0.15,
            maxAngle: 85,
            friction: 0.1,
        };
    }

//     public checkCollision(vec: Vector2, radAngleShift = this.radiusUnitAngle, matrix: number[][]) {
//         let responseX = 0;
//         let responseY = 0;

//         let collision = false;

//         const potentialX = this.position.x + vec.x;
//         const potentialY = this.position.y + vec.y;
//         const vecAngle = Math.atan2(vec.y, vec.x);
//         const PIhalf = Math.PI / 2;
//         for (
//             let ang = vecAngle - PIhalf + radAngleShift;
//             ang < vecAngle + PIhalf - radAngleShift;
//             ang += this.radiusUnitAngle
//         ) {
//             const x = this.radius * Math.cos(ang) + potentialX;
//             const y = this.radius * Math.sin(ang) + potentialY;

//             {
//                 //test
//                 const vec = new Vector2(x - this.position.x, y - this.position.y);
//                 vec.setStart(this.position);
//                 // Utils.drawVector(vec, '#0000FF');
//             }

//             const [iX, iY] = Utils.worldCordsToIndex({ x, y });
//             if (matrix[iY] && matrix[iY][iX] && matrix[iY][iX].value !== 0) {
//                 matrix[iY][iX].draw('#FF0000');
//                 responseX += x - this.position.x;
//                 responseY += y - this.position.y;
//                 collision = true;
//             }
//             // Utils.drawPoint(new Point2(x,y));
//         }

//         return collision ? new Vector2(responseX, responseY) : null;
//     }
 }
