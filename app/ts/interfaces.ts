import Loop from '../client/app/game/loop/Loop';

export interface IStartGameOptions {
    test?: boolean;
}

export interface IGMLoops {
    paused: boolean;
    timestamp: number;
    all: Record<string, Loop>;
}
