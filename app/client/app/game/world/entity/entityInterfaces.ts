import { Vector2 } from '../../../../utils/geometry';

export type Physics = {
    acceleration: Vector2;
    velocity: Vector2;
    g: number;
    friction: number;
};

export type Moves = {
    a: Vector2;
    v: Vector2;
    direction: number;
    speed: number;
    maxAngle: number;
    friction: number;
};
