import { IStartGameOptions } from './interfaces';

export type TLoopCallback = (time: number) => void;

export type TStartGameCallback = (options: IStartGameOptions) => void;
