export const enum ESocketMessages {
    logUserReq = 'log-user-request',
    logUserRes = 'log-user-response',
}

export interface ISocketLogUserReq {
    nickname: string;
}

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
