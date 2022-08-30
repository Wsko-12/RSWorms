import Loop from '../client/app/game/loop/Loop';
import { Point2, Vector2 } from '../client/utils/geometry';
import { EMapPacksNames, EWorldSizes } from './enums';
import { TClassProperty, TAttrProperty, TDatasetProperty, TContentProperty } from './types';

export interface IStartGameOptions {
    mapTexturePackName: EMapPacksNames;
    worldSize: EWorldSizes;
    seed: number;
    decor: {
        count: number;
        max: number;
        min: number;
    };
    wormsCount: number;
    multiplayer: boolean;
    teamNames: string[];
    playerNames: string[];
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
    position: Point2;
    wormDirection: 1 | -1;
    parentRadius: number;
}

export interface IBulletOptions {
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
    isCelebrated: boolean;
    isDrown: boolean;
    isDead: boolean;
}

export interface IWormMoveOptions {
    flags: {
        left: boolean;
        right: boolean;
    };
    direction: 1 | -1;
    speed: number;
    a: Vector2;
    v: Vector2;
    maxAngle: number;
}

export interface ICustomMouseEvent {
    x: number;
    y: number;
}

export interface ICreateElementProps {
    classes?: TClassProperty;
    id?: string;
    attrs?: TAttrProperty;
    dataset?: TDatasetProperty;
    content?: TContentProperty;
}
