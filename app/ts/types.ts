import Entity from '../client/app/game/world/entity/Entity';
import { IStartGameOptions } from './interfaces';

export type TLoopCallback = (time: number) => void;

export type TStartGameCallback = (options: IStartGameOptions) => void;

export type TRemoveEntityCallback = (entity: Entity) => void;
