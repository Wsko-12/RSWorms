import { ELangs } from '../../../../../ts/enums';
import { TRemoveEntityCallback } from '../../../../../ts/types';
import Worm from '../../world/entity/worm/Worm';

export default class Team {
    worms: Worm[] = [];
    currentWormIdx = 0;
    index: number;
    name: string;
    constructor(index: number, name = 'developers') {
        this.name = name + index;
        this.index = index;
    }

    pushWorm(worm: Worm) {
        this.worms.push(worm);
    }

    getHP() {
        return this.worms.reduce((hp, worm) => (hp += worm.getHP()), 0);
    }

    checkWorms() {
        this.worms = this.worms.filter((worm) => !worm.isDead());
    }

    getNextWorm() {
        if (this.currentWormIdx >= this.worms.length) {
            this.currentWormIdx = 0;
        }
        return this.worms[this.currentWormIdx++];
    }

    celebrate() {
        this.worms.forEach((worm) => worm.celebrate());
    }
}
