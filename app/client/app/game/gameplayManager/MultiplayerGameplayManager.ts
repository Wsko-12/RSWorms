import { IStartGameOptions } from '../../../../ts/interfaces';
import GameInterface from '../gameInterface/GameInterface';
import IOManager from '../IOManager/IOManager';
import World from '../world/World';
import GameplayManager from './GameplayManager';

export default class MultiplayerGameplayManager extends GameplayManager {
    constructor(options: IStartGameOptions, world: World, ioManager: IOManager, gameInterface: GameInterface) {
        super(options, world, ioManager, gameInterface);
    }

    init(options: IStartGameOptions) {
        this.createTeams(options);
        this.gameInterface.teamsHPElement.build(this.teams);
        this.gameInterface.teamsHPElement.update(this.teams);

        this.gameInterface.windElement.update(0);
    }

    turnLoop() {
        return;
    }
}
