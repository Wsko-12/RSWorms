import { EMapPacksNames, EWorldSizes } from './enums';
import { IStartGameOptions } from './interfaces';

export const enum ESocketLobbyMessages {
    logUserReq = 'log-user-request',
    logUserRes = 'log-user-response',
    roomsTableReq = 'rooms-table-request',
    roomCreateReq = 'room-create-request',
    roomsTableUpdate = 'rooms-table-update',
    roomToggle = 'room-toggle',
    roomReady = 'room-ready',
}

export interface ISocketLogUserReq {
    nickname: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSocketListenerTuple = [string, (data?: any) => void];

export const enum ESocketLogUserResStatuses {
    success = 'success',
    isTaken = 'is-taken',
    isIncorrect = 'is-incorrect',
}

export interface ISocketLogUserRes {
    status: ESocketLogUserResStatuses;
    rename: boolean;
    name: null | string;
}

export interface ISocketRoomsTableDataItem {
    id: string;
    owner: string;
    teams: number;
    time: number;
    players: string[];
    worms: number;
    hp: number;
    size: EWorldSizes;
    texture: EMapPacksNames;
}

export interface ISocketRoomsTableData {
    rooms: ISocketRoomsTableDataItem[];
}

export interface ISocketRoomToggleData {
    user: string;
    room: string;
    status: 'join' | 'leave';
}

export interface ISocketRoomReady {
    id: string;
}

export const enum ESocketGameMessages {
    startLoading = 'game-loading',
    loadingDone = 'game-loading-done',
    allPlayersLoaded = 'game-all-players-loaded',
}

export interface ISocketLoadingMultiplayerGameData extends IStartGameOptions {
    multiplayer: true;
}

export interface ISocketDoneLoadingMultiplayerGame {
    user: string;
    game: string;
}
