import Loop from '../client/app/game/loop/Loop';
import { Point2, Vector2 } from '../client/utils/geometry';
import { EMapPacksNames, EWorldSizes } from './enums';

export interface IStartGameOptions {
    mapTexturePackName: EMapPacksNames;
    worldSize: EWorldSizes;
    seed: number;
    decor: {
        count: number;
        max: number;
        min: number;
    };
}

export interface IGMLoops {
    paused: boolean;
    timestamp: number;
    all: Record<string, Loop>;
}

export interface IPhysics {
    velocity: Vector2;
    g: number;
    friction: number;
}

export interface IShootOptions {
    angle: number;
    power: number;
    position: Point2;
    parentRadius: number;
}

export interface IExplosionOptions {
    damage: number;
    point: Point2;
    radius: number;
    kickForce: number;
}

export interface IWormMoveStates {
    isSlide: boolean;
    isMove: boolean;
    isJump: boolean;
    isDoubleJump: boolean;
    isFall: boolean;
    isDamaged: boolean;
}
