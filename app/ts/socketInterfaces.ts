import { EBullets, EMapPacksNames, EWeapons, EWorldSizes } from './enums';
import { IBulletOptions, IStartGameOptions, IWormMoveStates } from './interfaces';

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
    preTurnData = 'game-pre-turn-data',
    teamWin = 'game-team-win',
    teamsAvailability = 'game-teams-availability',
    entityDataClient = 'entity-data-client',
    entityDataServer = 'entity-data-server',
    bulletCreatingClient = 'bullet-creating-client',
    bulletCreatingServer = 'bullet-creating-server',
    endingTurnTimestampClient = 'game-ending-turn-timestamp-client',
    endingTurnTimestampServer = 'game-ending-turn-timestamp-server',
    endTurnDataClient = 'game-end-turn-data-client',
    endTurnDataServer = 'game-end-turn-data-server',
}

export interface ISocketLoadingMultiplayerGameData extends IStartGameOptions {
    multiplayer: true;
}

export interface ISocketDoneLoadingMultiplayerGame {
    user: string;
    game: string;
}

export interface ISocketAllPlayersLoadedData {
    game: string;
}

export interface ISocketTeamsAvailability {
    game: string;
    teams: string[];
}

export interface ISocketTeamWinData {
    team: string;
    game: string;
}

export interface ISocketPreTurnData extends ISocketTeamsAvailability {
    wind: number;
    team: string;
    worm: string;
    timestamp: number;
}

export interface ISocketEntityData {
    id: string;
    physics: { x: number; y: number };
    position: { x: number; y: number };
}

export interface ISocketWormData extends ISocketEntityData {
    moveFlags: {
        left: boolean;
        right: boolean;
    };
    moveStates: IWormMoveStates;
    weaponSelected: EWeapons | null;
    aim: {
        angle: number;
        power: number;
    } | null;
}

export interface ISocketEntityDataPack {
    game: string;
    entities: ISocketEntityData[];
}

export interface ISocketBulletData {
    game: string;
    type: EBullets;
    data: ISocketEntityData;
    options: IBulletOptions;
}

export interface ISocketEndingTurnTimestamp {
    game: string;
    timestamp: number;
}

export interface ISocketEndTurnData {
    game: string;
    teams: Array<{
        name: string;
        worms: Array<{
            name: string;
            hp: number;
            position: {
                x: number;
                y: number;
            };
        }>;
    }>;
}
