import DEV from '../../../../server/DEV';
import { IStartGameOptions } from '../../../../ts/interfaces';
import { ESocketGameMessages } from '../../../../ts/socketInterfaces';
import ClientSocket from '../../clientSocket/ClientSocket';
import Multiplayer from '../../multiplayer/Multiplayer';
import GameInterface from '../gameInterface/GameInterface';
import IOManager from '../IOManager/IOManager';
import World from '../world/World';
import GameplayManager from './GameplayManager';

export default class MultiplayerGameplayManager extends GameplayManager {
    constructor(options: IStartGameOptions, world: World, ioManager: IOManager, gameInterface: GameInterface) {
        super(options, world, ioManager, gameInterface);
    }

    init(options: IStartGameOptions) {
        this.applySocketListeners();
        this.createTeams(options);
        this.gameInterface.teamsHPElement.build(this.teams);
        this.gameInterface.teamsHPElement.update(this.teams);

        this.gameInterface.windElement.update(0);
    }

    applySocketListeners() {
        ClientSocket.on(ESocketGameMessages.allPlayersLoaded, () => {
            if (DEV.showSocketResponseAndRequest) {
                console.log(`Response: ${ESocketGameMessages.allPlayersLoaded}`);
            }
            Multiplayer.showWaitingPlayersScreen(false);
        });
    }

    turnLoop() {
        return;
    }
}
