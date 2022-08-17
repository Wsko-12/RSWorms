import Entity from './Entity';
import Team from './Team';

export default class Worm extends Entity {
    name: string;
    hp: number;
    team: Team;
    constructor(name: string, hp = 100, team: Team) {
        super(1, 1, 1); /* temporarily */
        this.name = name;
        this.hp = hp;
        this.team = team;
    }
}
