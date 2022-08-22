import Entity from '../client/app/game/world/entity/Entity';
import { IStartGameOptions } from './interfaces';

export type TLoopCallback = (time: number) => void;

export type TStartGameCallback = (options: IStartGameOptions) => void;

export type TRemoveEntityCallback = (entity: Entity) => void;

export type TClassProperty = string[] | string;

export type TAttrProperty = { [key: string]: string | number | boolean };

export type TDatasetProperty = { [key: string]: string | number };

export type TContentProperty = string | (HTMLElement | string)[] | HTMLElement;
