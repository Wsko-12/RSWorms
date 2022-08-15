import Loop from '../client/app/game/loop/Loop';
import { EMapPacksNames, EWorldSizes } from './enums';

export interface IStartGameOptions {
    mapTexturePackName: EMapPacksNames;
    worldSize: EWorldSizes;
}

export interface IGMLoops {
    paused: boolean;
    timestamp: number;
    all: Record<string, Loop>;
}
