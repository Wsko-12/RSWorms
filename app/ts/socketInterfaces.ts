import { EWorldSizes } from './enums';

export const enum ESocketLobbyMessages {
    logUserReq = 'log-user-request',
    logUserRes = 'log-user-response',
    roomsTableReq = 'rooms-table-request',
    roomCreateReq = 'room-create-request',
    roomsTableUpdate = 'rooms-table-update',
    roomToggle = 'room-toggle',
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
    texture: string;
}

export interface ISocketRoomsTableData {
    rooms: ISocketRoomsTableDataItem[];
}

export interface ISocketRoomToggleData {
    user: string;
    room: string;
    status: 'join' | 'leave';
}
