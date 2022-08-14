import GameInterface from '../gameInterface/GameInterface';
import World from '../world/World';

export default class IOManager {
    gameInterface: GameInterface;
    world: World;

    constructor(gameInterface: GameInterface, world: World) {
        this.gameInterface = gameInterface;
        this.world = world;
    }
}
