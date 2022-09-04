import { getRandomMemberName } from '../../../../client/utils/names';
import { ELang, EMapPacksDecorItems, EMapPacksNames } from '../../../../ts/enums';
import { ITeamOptions } from '../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ISocketAllPlayersLoadedData,
    ISocketEndTurnData,
    ISocketLoadingMultiplayerGameData,
    ISocketPreTurnData,
    ISocketRoomsTableDataItem,
    ISocketTeamsAvailability,
    ISocketTeamWinData,
} from '../../../../ts/socketInterfaces';
import ManagerItem from '../ManagerItem';
import User from '../userManager/User';
import UserManager from '../userManager/UserManager';

interface IGameServerWorm {
    name: string;
    hp: number;
    position: { x: number; y: number };
}
interface IGameServerTeam {
    worms: IGameServerWorm[];
    name: string;
    lastTurn: number;
}
export default class Game extends ManagerItem {
    private users: User[] = [];
    private turns: {
        counter: number;
        currentTeam: string;
    };

    private teams: Record<string, IGameServerTeam> = {};
    public id: string;
    private playersLoadedGameStates: Record<string, boolean> = {};
    private started = false;
    constructor(options: ISocketRoomsTableDataItem) {
        super();
        this.id = options.id;

        this.turns = {
            counter: -1,
            currentTeam: '',
        };

        this.teams = this.generateTeams(options);

        const userManager = new UserManager();
        options.players.forEach((name) => {
            this.playersLoadedGameStates[name] = false;
            const user = userManager.getUserByName(name);
            if (user) {
                user.setGame(this.id);
                this.users.push(user);
            }
        });

        const loadingGameData = this.generateLoadingGameData(options);

        this.sendAll(ESocketGameMessages.startLoading, loadingGameData);
    }

    private sendTeamsAvailability() {
        Object.keys(this.teams).forEach((name) => {
            const team = this.teams[name];
            team.worms = team.worms.filter((worm) => worm.hp > 0);
        });

        Object.keys(this.teams).forEach((name) => {
            const team = this.teams[name];
            if (team.worms.length === 0) {
                delete this.teams[name];
            }
        });

        const teamNames = Object.keys(this.teams);
        const data: ISocketTeamsAvailability = {
            game: this.id,
            teams: [...teamNames],
        };

        this.sendAll(ESocketGameMessages.teamsAvailability, data);

        if (teamNames.length <= 1) {
            const data: ISocketTeamWinData = {
                team: teamNames[0],
                game: this.id,
            };

            this.sendAll(ESocketGameMessages.teamWin, data);

            return true;
        } else {
            return false;
        }
    }

    private sendPreTurnData() {
        this.turns.counter++;
        const isFinished = this.sendTeamsAvailability();
        if (isFinished) {
            return;
        }
        this.started = true;

        const teamNames = Object.keys(this.teams);
        const currentTeam = teamNames[this.turns.counter % teamNames.length];

        const data: ISocketPreTurnData = {
            game: this.id,
            teams: [...teamNames],
            wind: Math.random(),
            team: currentTeam,
            worm: this.getWormTurnName(this.teams[currentTeam]),
            timestamp: Date.now(),
        };

        this.sendAll(ESocketGameMessages.preTurnData, data);
        return teamNames.length <= 1;
    }

    private getWormTurnName(team: IGameServerTeam) {
        team.lastTurn++;
        if (team.lastTurn >= team.worms.length) {
            team.lastTurn = 0;
        }

        const worm = team.worms[team.lastTurn];
        return worm.name;
    }

    public applyEndTurnData(data: ISocketEndTurnData) {
        data.teams.forEach((team) => {
            const thisTeam = this.teams[team.name];
            if (thisTeam) {
                team.worms.forEach((wormClient) => {
                    const thisWorm = thisTeam.worms.find((worm) => wormClient.name === worm.name);
                    if (thisWorm) {
                        thisWorm.hp = wormClient.hp;
                        thisWorm.position = wormClient.position;
                    }
                });
            }
        });

        this.sendAll(ESocketGameMessages.endTurnDataServer, data);
        this.sendPreTurnData();
    }

    private generateTeams(options: ISocketRoomsTableDataItem): Record<string, IGameServerTeam> {
        const teams: Record<string, IGameServerTeam> = {};
        options.players.forEach((name) => {
            const team: IGameServerTeam = {
                worms: [],
                name,
                lastTurn: -1,
            };

            for (let i = 0; i < options.worms; i++) {
                const worm: IGameServerWorm = {
                    name: getRandomMemberName() + i,
                    hp: options.hp,
                    position: { x: 0, y: 0 },
                };

                team.worms.push(worm);
            }

            teams[name] = team;
        });

        return teams;
    }

    private generateLoadingGameData(options: ISocketRoomsTableDataItem): ISocketLoadingMultiplayerGameData {
        const teams = Object.values(this.teams).map((team) => {
            const worms = team.worms.map((worm) => worm.name);
            const name = team.name;
            const lang = ELang.eng;
            return {
                name,
                worms,
                lang,
            };
        });

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
        const index = Object.keys(this.teams).indexOf(name);
        if (index != -1) {
            const user = this.users[index];
            delete this.teams[name];
            this.users.splice(index, 1);
            delete this.playersLoadedGameStates[name];
            this.checkPlayerLoadedStates();
            this.sendTeamsAvailability();
        }
        if (this.users.length <= 0) {
            this.removeFromManager();
        }
    }
}
