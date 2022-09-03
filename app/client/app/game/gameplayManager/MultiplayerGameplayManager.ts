import DEV from '../../../../server/DEV';
import { IStartGameOptions } from '../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ISocketAllPlayersLoadedData,
    ISocketPreTurnData,
    ISocketTeamsAvailability,
    ISocketTeamWinData,
} from '../../../../ts/socketInterfaces';
import ClientSocket from '../../clientSocket/ClientSocket';
import MultiplayerInterface from '../../lobby/multiplayerInterface/MultiplayerInterface';
import User from '../../User';
import GameInterface from '../gameInterface/GameInterface';
import IOManager from '../IOManager/IOManager';
import World from '../world/World';
import GameplayManager from './GameplayManager';

export default class MultiplayerGameplayManager extends GameplayManager {
    constructor(options: IStartGameOptions, world: World, ioManager: IOManager, gameInterface: GameInterface) {
        super(options, world, ioManager, gameInterface);
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
    }

    private applyPreTurnData(data: ISocketPreTurnData) {
        console.log('PreTurnData: ', data);
        this.checkTeamsAvailable(data.teams);
        this.gameInterface.teamsHPElement.update(this.teams);
        const wind = this.world.changeWind(data.wind);
        this.gameInterface.windElement.update(wind);

        const currentTeam = this.teams.find((team) => team.name === data.team);
        const currentWorm = currentTeam?.getWorm(data.worm);
        console.log('Current worm: ', currentWorm);
        if (currentWorm) {
            this.ioManager.wormManager.setWorm(currentWorm);
        }else{
            console.log(data.worm);
            console.log(currentTeam);
        }
    }

    private checkTeamsAvailable(teams: string[]) {
        console.log('teams', teams);
        const toDelete = this.teams.filter((team) => !teams.includes(team.name));
        toDelete.forEach((team) => {
            team.delete();
        });

        this.teams = this.teams.filter((team) => !toDelete.includes(team));
    }

    public turnLoop() {
        return;
    }
}
