import { IStartGameOptions } from '../../../../ts/interfaces';
import { TEndTurnCallback } from '../../../../ts/types';
import IOManager from '../IOManager/IOManager';
import EntityManager from '../world/entity/EntityManager';
import Team from './team/Team';

export default class gameplayManager {
    private entityManager: EntityManager;
    private ioManager: IOManager;
    private teams: Team[] = [];
    private currentTurn = -1;
    private turnTimestamp = 0;
    private turnTime = 45;
    private endTurnTime = 5;
    private isEnding = 0;
    constructor(entityManager: EntityManager, ioManager: IOManager) {
        this.entityManager = entityManager;
        this.ioManager = ioManager;
    }

    private createTeams(options: IStartGameOptions) {
        if (!options.multiplayer) {
            const teamsCount = options.teamNames.length;
            for (let i = 0; i < teamsCount; i++) {
                const team = new Team(i);
                for (let j = 0; j < options.wormsCount; j++) {
                    const worm = this.entityManager.generateWorm(i, j);
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
        this.createTeams(options);
        this.nextTurn();
    }

    nextTurn() {
        this.isEnding = 0;
        this.turnTimestamp = Date.now();
        this.currentTurn++;
        const teamIndex = this.currentTurn % this.teams.length;
        const currentTeam = this.teams[teamIndex];
        const currentWorm = currentTeam.getNextWorm();

        const previousWorm = this.ioManager.wormManager.getWorm();
        if (previousWorm) {
            previousWorm.endTurn();
        }
        currentWorm.startTurn(this.endTurn);
        this.ioManager.wormManager.setWorm(currentWorm);
    }

    endTurn: TEndTurnCallback = (delaySec: number) => {
        this.isEnding = Date.now() + delaySec * 1000;
    };

    turnLoop() {
        if (this.isEnding) {
            console.log((Date.now() - this.isEnding) / 1000);
            if (Date.now() > this.isEnding) {
                this.nextTurn();
            }
        } else {
            console.log((Date.now() - this.turnTimestamp) / 1000);

            if (Date.now() - this.turnTimestamp > this.turnTime * 1000) {
                this.nextTurn();
            }
        }
    }
}
