import DEV from '../../../../server/DEV';
import { IStartGameOptions } from '../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ISocketAllPlayersLoadedData,
    ISocketBulletData,
    ISocketEndingTurnTimestamp,
    ISocketEndTurnData,
    ISocketEntityDataPack,
    ISocketPreTurnData,
    ISocketReadyForNextTurn,
    ISocketTeamsAvailability,
    ISocketTeamWinData,
} from '../../../../ts/socketInterfaces';
import { TEndTurnCallback } from '../../../../ts/types';
import ClientSocket from '../../clientSocket/ClientSocket';
import MultiplayerInterface from '../../lobby/multiplayerInterface/MultiplayerInterface';
import User from '../../User';
import GameInterface from '../gameInterface/GameInterface';
import IOManager from '../IOManager/IOManager';
import BBazooka from '../world/entity/worm/weapon/bullet/shottable/parabolic/bazooka/BBazooka';
import BDynamite from '../world/entity/worm/weapon/bullet/throwable/Fallen/dynamite/BDynamite';
import BMine from '../world/entity/worm/weapon/bullet/throwable/Fallen/mine/Bmine';
import BGrenade from '../world/entity/worm/weapon/bullet/throwable/Flight/grenade/BGrenade';
import BHolyGrenade from '../world/entity/worm/weapon/bullet/throwable/Flight/holygrenade/BHolyGrenade';
import Worm from '../world/entity/worm/Worm';
import World from '../world/World';
import GameplayManager from './GameplayManager';

const bulletConstructors = {
    BBazooka: BBazooka,
    BGrenade: BGrenade,
    BHolyGrenade: BHolyGrenade,
    BMine: BMine,
    BDynamite: BDynamite,
};

export default class MultiplayerGameplayManager extends GameplayManager {
    public static instance: MultiplayerGameplayManager | null = null;
    public static isOnline = false;

    public static getCurrentTurnPlayerName() {
        return this.instance?.currentTeamName || '';
    }

    public currentTeamName = '';
    public id = '';

    constructor(options: IStartGameOptions, world: World, ioManager: IOManager, gameInterface: GameInterface) {
        super(options, world, ioManager, gameInterface);
        this.id = options.id;
        MultiplayerGameplayManager.instance = this;
        MultiplayerGameplayManager.isOnline = true;
    }

    public init(options: IStartGameOptions) {
        this.applySocketListeners();
        this.createTeams(options);
        this.gameInterface.teamsHPElement.build(this.teams);
        this.gameInterface.teamsHPElement.update(this.teams);

        this.gameInterface.windElement.update(0);
    }

    private applySocketListeners() {
        ClientSocket.on<ISocketAllPlayersLoadedData>(ESocketGameMessages.allPlayersLoaded, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.allPlayersLoaded}`);
            }
            if (data && data.game === User.inGame) {
                MultiplayerInterface.showWaitingPlayersScreen(false);
            }
        });

        ClientSocket.on<ISocketTeamsAvailability>(ESocketGameMessages.teamsAvailability, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.teamsAvailability}`);
            }
            if (data && data.game === User.inGame) {
                this.checkTeamsAvailable(data.teams);
            }
        });

        ClientSocket.on<ISocketPreTurnData>(ESocketGameMessages.preTurnData, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.preTurnData}`);
            }
            if (data && data.game === User.inGame) {
                this.applyPreTurnData(data);
            }
        });

        ClientSocket.on<ISocketTeamWinData>(ESocketGameMessages.teamWin, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.teamWin}`);
            }
            if (data && data.game === User.inGame) {
                const team = this.teams.find((team) => team.name === data.team);
                team?.celebrate();
            }
        });

        ClientSocket.on<ISocketEntityDataPack>(ESocketGameMessages.entityDataServer, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.entityDataServer}`, data);
            }
            if (data && data.game === User.inGame) {
                if (MultiplayerGameplayManager.getCurrentTurnPlayerName() != User.inGame) {
                    this.world.entityManager.setSocketData(data.entities);
                }
            }
        });

        ClientSocket.on<ISocketBulletData>(ESocketGameMessages.bulletCreatingServer, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.bulletCreatingServer}`, data);
            }

            if (data && data.game === User.inGame) {
                if (MultiplayerGameplayManager.getCurrentTurnPlayerName() != User.nickname) {
                    const Constructor = bulletConstructors[data.type];
                    const bullet = new Constructor(data.options);
                    bullet.id = data.data.id;

                    this.world.getMainScene().add(bullet.getObject3D());
                    this.entityManager.addEntity(bullet);
                }
            }
        });

        ClientSocket.on<ISocketEndingTurnTimestamp>(ESocketGameMessages.endingTurnTimestampServer, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.endingTurnTimestampServer}`, data);
            }

            if (data && data.game === User.inGame) {
                this.isEnding = data.timestamp;
            }
        });

        ClientSocket.on<ISocketEndTurnData>(ESocketGameMessages.endTurnDataServer, (data) => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.endingTurnTimestampServer}`, data);
            }

            if (data && data.game === User.inGame) {
                this.applyEndTurnData(data);
            }
        });
    }

    private applyEndTurnData(data: ISocketEndTurnData) {
        this.teams.forEach((cTeam) => {
            const serverTeam = data.teams.find((sTeam) => sTeam.name === cTeam.name);
            if (serverTeam) {
                serverTeam.worms.forEach((sWorm) => {
                    const cWorm = cTeam.worms.find((cWorm) => cWorm.name === sWorm.name);
                    if (cWorm) {
                        cWorm.setHPLevel(sWorm.hp);
                        cWorm.position.x = sWorm.position.x;
                        cWorm.position.y = sWorm.position.y;
                    }
                });
            }
        });
    }

    private applyPreTurnData(data: ISocketPreTurnData) {
        this.isBetweenTurns = false;
        this.checkTeamsAvailable(data.teams);
        this.gameInterface.teamsHPElement.update(this.teams);
        const wind = this.world.changeWind(data.wind);
        this.gameInterface.windElement.update(wind);

        const prevWorm = this.ioManager.wormManager.getWorm();
        if (prevWorm) {
            prevWorm.endTurn();
        }

        const currentTeam = this.teams.find((team) => team.name === data.team);
        this.currentTeamName = currentTeam?.name || '';
        const currentWorm = currentTeam?.getWorm(data.worm);
        if (currentWorm) {
            this.ioManager.wormManager.setWorm(currentWorm);
            this.nextTurnMultiplayer(currentWorm);
        }

        this.isEnding = 0;
        this.turnTimestamp = data.timestamp;
        this.gameInterface.timerElement.show(true);
    }

    private nextTurnMultiplayer(worm: Worm) {
        worm.startTurn(this.endTurn);
    }

    public nextTurn(): void {
        return;
    }

    protected betweenTurns() {
        this.currentTeamName = '';
        this.gameInterface.timerElement.show(false);

        const previousWorm = this.ioManager.wormManager.getWorm();
        if (previousWorm) {
            previousWorm.endTurn();
        }
        this.ioManager.wormManager.setWorm(null);

        this.isBetweenTurns = true;
        const entities = this.entityManager.getEntities();
        const promises = entities.map((entity) => entity.betweenTurnsActions());
        Promise.all(promises).then(() => {
            setTimeout(() => {
                const entities = this.entityManager.getEntities();
                const allReady = entities.every((entity) => entity.readyToNextTurn());
                this.gameInterface.teamsHPElement.update(this.teams);
                if (allReady) {
                    setTimeout(() => {
                        if (MultiplayerGameplayManager.getCurrentTurnPlayerName() === User.nickname) {
                            this.sendEndTurnData();
                        }
                        this.sendReadyForNextTurn();
                    }, 2000);
                } else {
                    this.betweenTurns();
                }
            }, 1000);
        });
    }

    private sendReadyForNextTurn() {
        if (User.inGame) {
            const data: ISocketReadyForNextTurn = {
                game: User.inGame,
                user: User.nickname,
            };
            ClientSocket.emit(ESocketGameMessages.userReadyForNextTurn, data);
        }
    }

    private sendEndTurnData() {
        const data: ISocketEndTurnData = {
            game: this.id,
            teams: this.teams.map((team) => team.getSocketData()),
        };

        ClientSocket.emit(ESocketGameMessages.endTurnDataClient, data);
    }

    public endTurn: TEndTurnCallback = (delaySec) => {
        if (User.nickname === MultiplayerGameplayManager.getCurrentTurnPlayerName() && User.inGame) {
            const data: ISocketEndingTurnTimestamp = {
                timestamp: Date.now() + delaySec * 1000,
                game: User.inGame,
            };

            ClientSocket.emit(ESocketGameMessages.endingTurnTimestampClient, data);
        }
    };

    private checkTeamsAvailable(teams: string[]) {
        const toDelete = this.teams.filter((team) => !teams.includes(team.name));
        toDelete.forEach((team) => {
            team.delete();
        });

        this.teams = this.teams.filter((team) => !toDelete.includes(team));
    }

    public turnLoop() {
        if (this.isEnding) {
            this.gameInterface.timerElement.update(this.isEnding - Date.now() + 1000);

            if (Date.now() > this.isEnding && !this.isBetweenTurns) {
                this.betweenTurns();
                this.entityManager.sendLastData();
            }
        } else {
            const ms = this.turnTime * 1000 - (Date.now() - this.turnTimestamp) + 1000;
            this.gameInterface.timerElement.update(ms);

            if (ms < 0) {
                return;
            }

            if (Date.now() - this.turnTimestamp > ms) {
                this.entityManager.sendLastData();
                this.betweenTurns();
            }
        }
    }

    public socketLoop() {
        this.entityManager.socketLoop();
    }
}
