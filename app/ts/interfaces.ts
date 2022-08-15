import Loop from '../client/app/game/loop/Loop';
import { EMapPacksNames } from './enums';

export interface IStartGameOptions {
    mapTexturePackName: EMapPacksNames;
}

export interface IGMLoops {
    paused: boolean;
    timestamp: number;
    all: Record<string, Loop>;
}
