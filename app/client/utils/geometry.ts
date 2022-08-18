const element = document.createElement('canvas');

const ctx = element.getContext('2d');

export class Point2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Point2(this.x, this.y);
    }

    getDistanceToPoint(point: Point2) {
        return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
    }
}

export class Point3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class Vector2 {
    x: number;
    y: number;
    start: Point2;
    end: Point2;
    length: number;

    static rotate(vector: Vector2, angle: number) {
        // angle in radians
        const rotatedX = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
        const rotatedY = vector.x * Math.sin(angle) - vector.y * Math.cos(angle);
        vector.x = rotatedX;
        vector.y = rotatedY;
    }
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.start = new Point2(0, 0);
        this.end = new Point2(x, y);
        this.length = this.getLength();
    }

    add(vec: Vector2) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    setStart(point: Point2) {
        this.start.x = point.x;
        this.start.y = point.y;

        this.end.x = point.x + this.x;
        this.end.y = point.y + this.y;
        return this;
    }

    setDist(value: number) {
        this.normalize();
        this.scale(value);
        return this;
    }

    clone() {
        const clone = new Vector2(this.x, this.y);
        clone.setStart(this.start);
        return clone;
    }

    normalize() {
        const length = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;

        this.length = this.getLength();
        this.setStart(this.start);
        return this;
    }

    scale(scalar: number) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.length = this.getLength();
        this.setStart(this.start);
        return this;
    }

    getLength() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    dotProduct(vector: Vector2) {
        return this.x * vector.x + this.y * vector.y;
    }

    isIntersectCircle(center: Point2, r: number, returnPoints: Point2) {
        // http://joxi.ru/8An8WgnHKvoD4m

        // origin - our vector start;
        const origin = new Point2(this.start.x, this.start.y);

        //OC - vector from origin to circle center
        const OC = new Vector2(center.x - origin.x, center.y - origin.y);

        // Point T - proaction OC to our Vector;
        const OT_length = this.clone().normalize().dotProduct(OC);
        const CT_length = Math.sqrt(OC.length ** 2 - OT_length ** 2);

        if (!returnPoints) {
            if (CT_length > r) {
                return false;
            } else {
                return true;
            }
        }

        if (CT_length > r) {
            return null;
        }

        // Point A - closets point from origin were out Vector intersect circle;
        const AT_length = Math.sqrt(r ** 2 - CT_length ** 2);
        const OA_length = OT_length - AT_length;

        const A = this.clone().normalize().scale(OA_length).end.clone();

        // Point B - farthest point from origin were out Vector intersect circle;
        const OB_length = OT_length + AT_length;
        const B = this.clone().normalize().scale(OB_length).end.clone();

        // Need to fix situations when origin inside the circle

        return {
            a: A,
            b: B,
        };
    }

    isIntersectLine(line: Vector2, inf: number) {
        //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
        const x1 = line.start.x;
        const y1 = line.start.y;
        const x2 = line.end.x;
        const y2 = line.end.y;

        const x3 = this.start.x;
        const y3 = this.start.y;
        const x4 = this.end.x;
        const y4 = this.end.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (den === 0) {
            return false;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / den;

        if ((0 < t && t < 1 && 0 < u && u < 1) || inf) {
            const x = x1 + t * (x2 - x1);
            const y = y1 + t * (y2 - y1);
            return new Point2(x, y);
        } else {
            return false;
        }
    }
}

export class Line {
    start: Point2;
    end: Point2;
    constructor(pStart: Point2, pEnd: Point2) {
        this.start = pStart.clone();
        this.end = pEnd.clone();
    }
}

// export class Utils {
//     static drawPoint(point: Point2, color = 'blue') {
//         const x = point.x * CEIL_SIZE_PX;
//         const y = REVERSE_PX - point.y * CEIL_SIZE_PX;
//         if (ctx) {
//             ctx.fillStyle = color;
//             ctx.beginPath();
//             ctx.arc(x, y, 0.2 * CEIL_SIZE_PX, 0, 2 * Math.PI);
//             ctx.fill();
//         }
//     }

//     static drawVector(vec: Vector2, color = '#00FF00', scale: number) {
//         if (scale) {
//             vec = vec.clone().normalize().scale(5);
//         }
//         const start = vec.start;
//         const startX = start.x * CEIL_SIZE_PX;
//         const startY = REVERSE_PX - start.y * CEIL_SIZE_PX;

//         const end = vec.end;

//         const endX = end.x * CEIL_SIZE_PX;
//         const endY = REVERSE_PX - end.y * CEIL_SIZE_PX;

//         ctx.lineWidth = 0.2 * CEIL_SIZE_PX;
//         ctx.strokeStyle = color;

//         ctx.beginPath();
//         ctx.moveTo(startX, startY);
//         ctx.lineTo(endX, endY);
//         ctx.stroke();
//     }

//     static drawLine(line, color = '#ff0000') {
//         const start = line.start;
//         const startX = start.x * CEIL_SIZE_PX;
//         const startY = REVERSE_PX - start.y * CEIL_SIZE_PX;

//         const end = line.end;

//         const endX = end.x * CEIL_SIZE_PX;
//         const endY = REVERSE_PX - end.y * CEIL_SIZE_PX;

//         ctx.lineWidth = 0.2 * CEIL_SIZE_PX;
//         ctx.strokeStyle = color;

//         ctx.beginPath();
//         ctx.moveTo(startX, startY);
//         ctx.lineTo(endX, endY);
//         ctx.stroke();
//     }

//     static indexToWorldCords(x, y) {
//         return new Point2(x + MAP_CEIL_SIZE_UNITS / 2, y + MAP_CEIL_SIZE_UNITS / 2);
//     }

//     static worldCordsToIndex(point2) {
//         const x = Math.floor(point2.x / MAP_CEIL_SIZE_UNITS);
//         const y = Math.floor(point2.y / MAP_CEIL_SIZE_UNITS);
//         return [x, y];
//     }

//     static renderToWorldCords(point2) {
//         const x = point2.x / CEIL_SIZE_PX;
//         const y = MATRIX_SIZE_CEILS - point2.y / CEIL_SIZE_PX;

//         return new Point2(x, y);
//     }

//     static pixelsToWorldCords(point2) {
//         const box = canvas.getBoundingClientRect();
//         const x = (point2.x - box.x) / CEIL_SIZE_PX;
//         const y = (box.height - point2.y + box.y) / CEIL_SIZE_PX;

//         return new Point2(x, y);
//     }
// }
