import { type } from 'os';
import Entity from '../client/app/game/world/entity/Entity';
import Bullet from '../client/app/game/world/entity/worm/weapon/bullet/Bullet';
import CustomSocket from '../server/app/managers/socketsManager/customSocket/CustomSocket';
import User from '../server/app/managers/userManager/User';
import { EWeapons } from './enums';
import { IStartGameOptions } from './interfaces';

export type TLoopCallback = (time: number) => void;

export type TStartGameCallback = (options: IStartGameOptions) => void;

export type TRemoveEntityCallback = (entity: Entity) => void;

export type TEndTurnCallback = (delaySec: number) => void;

export type TChooseWeaponCallback = (weapon: EWeapons) => void;

export type TClassProperty = string[] | string;

export type TAttrProperty = { [key: string]: string | number | boolean };

export type TDatasetProperty = { [key: string]: string | number };

export type TContentProperty = string | (HTMLElement | string)[] | HTMLElement;
