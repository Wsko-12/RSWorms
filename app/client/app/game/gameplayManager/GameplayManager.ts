import { IStartGameOptions } from '../../../../ts/interfaces';
import { TEndTurnCallback } from '../../../../ts/types';
import GameInterface from '../gameInterface/GameInterface';
import IOManager from '../IOManager/IOManager';
import EntityManager from '../world/entity/EntityManager';
import Bullet from '../world/entity/worm/weapon/bullet/Bullet';
import World from '../world/World';
import Team from './team/Team';

export default class gameplayManager {
    private entityManager: EntityManager;
    private ioManager: IOManager;
    private gameInterface: GameInterface;
    private world: World;
    private teams: Team[] = [];
    private currentTurn = -1;
    private turnTimestamp = 0;
    private turnTime = 30;
    private endTurnTime = 5;
    private isEnding = 0;
    private isBetweenTurns = false;

    constructor(world: World, ioManager: IOManager, gameInterface: GameInterface) {
        this.world = world;
        this.entityManager = world.entityManager;
        this.ioManager = ioManager;
        this.gameInterface = gameInterface;
    }

    private checkTeams(): boolean {
        this.teams.forEach((team) => {
            team.checkWorms();
        });
        this.teams = this.teams.filter((team) => team.worms.length > 0);
        if (this.teams.length > 1) {
            return true;
        }
        if (this.teams.length === 1) {
            this.teams[0].celebrate();
        }

        return false;
    }

    private createTeams(options: IStartGameOptions) {
        if (!options.multiplayer) {
            const teamsCount = options.teams.length;
            for (let i = 0; i < teamsCount; i++) {
                const team = new Team(i, options.teams[i].name);
                for (let j = 0; j < options.wormsCount; j++) {
                    const wormName = options.teams[i].worms[j];
                    console.log(wormName)
                    const worm = this.entityManager.generateWorm(i, j, wormName);
                    if (!worm) {
                        throw new Error(`[GameplayManager] can't create worm`);
                    }
                    team.pushWorm(worm);
                }
                this.teams.push(team);
            }
        }
    }

    init(options: IStartGameOptions) {
        console.log(options)
        this.createTeams(options);
        this.gameInterface.teamsHPElement.build(this.teams);
        this.gameInterface.teamsHPElement.update(this.teams);

        this.nextTurn();
    }

    nextTurn() {
        const continueGame = this.checkTeams();
        if (!continueGame) {
            return;
        }
        this.isBetweenTurns = false;
        this.isEnding = 0;
        this.turnTimestamp = Date.now();
        this.currentTurn++;
        const wind = this.world.changeWind();
        this.gameInterface.windElement.update(wind);
        const teamIndex = this.currentTurn % this.teams.length;
        const currentTeam = this.teams[teamIndex];
        const currentWorm = currentTeam.getNextWorm();
        this.world.raiseWaterLevel();
        currentWorm.startTurn(this.endTurn);
        this.gameInterface.timerElement.show(true);
        this.ioManager.wormManager.setWorm(currentWorm);
    }

    endTurn: TEndTurnCallback = (delaySec: number) => {
        this.isEnding = Date.now() + delaySec * 1000;
    };

    private betweenTurns() {
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
                        this.nextTurn();
                    }, 2000);
                } else {
                    this.betweenTurns();
                }
            }, 1000);
        });
    }

    turnLoop() {
        if (this.isEnding) {
            this.gameInterface.timerElement.update(this.isEnding - Date.now() + 1000);
            if (Date.now() > this.isEnding && !this.isBetweenTurns) {
                this.betweenTurns();
            }
        } else {
            this.gameInterface.timerElement.update(this.turnTime * 1000 - (Date.now() - this.turnTimestamp) + 1000);

            if (Date.now() - this.turnTimestamp > this.turnTime * 1000 && !this.isBetweenTurns) {
                this.betweenTurns();
            }
        }
    }
}
