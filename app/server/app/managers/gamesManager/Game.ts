import { getRandomMemberName } from '../../../../client/utils/names';
import { ELang, EMapPacksDecorItems, EMapPacksNames } from '../../../../ts/enums';
import { ITeamOptions } from '../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ISocketAllPlayersLoadedData,
    ISocketLoadingMultiplayerGameData,
    ISocketPreTurnData,
    ISocketRoomsTableDataItem,
    ISocketTeamsAvailable,
    ISocketTeamWinData,
} from '../../../../ts/socketInterfaces';
import ManagerItem from '../ManagerItem';
import User from '../userManager/User';
import UserManager from '../userManager/UserManager';

export default class Game extends ManagerItem {
    private users: User[] = [];
    private turns: {
        teams: string[];
        counter: number;
        currentTeam: string;
    };
    public id: string;
    private playersLoadedGameStates: Record<string, boolean> = {};
    private started = false;
    constructor(options: ISocketRoomsTableDataItem) {
        super();
        this.id = options.id;

        this.turns = {
            teams: [],
            counter: -1,
            currentTeam: '',
        };

        const userManager = new UserManager();
        options.players.forEach((name) => {
            this.playersLoadedGameStates[name] = false;
            this.turns.teams.push(name);
            const user = userManager.getUserByName(name);
            if (user) {
                user.setGame(this.id);
                this.users.push(user);
            }
        });

        const loadingGameData = this.generateLoadingGameData(options);

        this.sendAll(ESocketGameMessages.startLoading, loadingGameData);
    }

    private sendTeamsAvailable() {
        const data: ISocketTeamsAvailable = {
            game: this.id,
            teams: [...this.turns.teams],
        };

        this.sendAll(ESocketGameMessages.preTurnData, data);

        if (this.turns.teams.length <= 1) {
            const data: ISocketTeamWinData = {
                team: this.turns.teams[0],
                game: this.id,
            };

            this.sendAll(ESocketGameMessages.teamWin, data);

            return true;
        } else {
            return false;
        }
    }

    private sendPreTurnData() {
        const isFinished = this.sendTeamsAvailable();
        if (isFinished) {
            return;
        }
        this.started = true;
        const data: ISocketPreTurnData = {
            game: this.id,
            teams: [...this.turns.teams],
        };

        this.sendAll(ESocketGameMessages.preTurnData, data);

        return this.turns.teams.length <= 1;
    }

    private generateLoadingGameData(options: ISocketRoomsTableDataItem): ISocketLoadingMultiplayerGameData {
        const teams: ITeamOptions[] = options.players.map((name) => ({
            lang: ELang.eng,
            worms: new Array(options.worms).fill(0).map(() => getRandomMemberName()),
            name,
        }));

        return {
            ...options,
            multiplayer: true,
            seed: Math.random(),
            decor: {
                count: EMapPacksDecorItems[options.texture],
                max: 6,
                min: 2,
            },
            teams,
        };
    }

    private checkPlayerLoadedStates() {
        if (!this.started) {
            const allPlayersLoadedGame = Object.values(this.playersLoadedGameStates).every((state) => state);
            if (allPlayersLoadedGame) {
                const data: ISocketAllPlayersLoadedData = {
                    game: this.id,
                };

                this.sendAll(ESocketGameMessages.allPlayersLoaded, data);
                const isFinished = this.sendPreTurnData();
            }
        }
    }

    public setPlayerLoadedState(name: string) {
        const user = this.findUserByName(name);
        if (user) {
            this.playersLoadedGameStates[name] = true;
            this.checkPlayerLoadedStates();
        }
    }

    private findUserByName(name: string) {
        return this.users.find((user) => user.name === name);
    }

    public sendAll<T>(msg: string, data?: T) {
        this.users.forEach((user) => {
            user.emit(msg, data);
        });
    }

    public removeUser(name: string) {
        const index = this.turns.teams.indexOf(name);
        if (index != -1) {
            const user = this.users[index];
            this.turns.teams.splice(index, 1);
            this.users.splice(index, 1);
            delete this.playersLoadedGameStates[name];
            this.checkPlayerLoadedStates();
            this.sendTeamsAvailable();
        }
        if (this.users.length <= 0) {
            this.removeFromManager();
        }
    }
}
