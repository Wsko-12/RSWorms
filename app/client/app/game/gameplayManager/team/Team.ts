import { ELangs } from '../../../../../ts/enums';
import { TRemoveEntityCallback } from '../../../../../ts/types';
import Worm from '../../world/entity/worm/Worm';

export default class Team {
    worms: Worm[] = [];
    currentWormIdx = 0;
    index: number;
    constructor(index: number) {
        this.index = index;
    }

    pushWorm(worm: Worm) {
        this.worms.push(worm);
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
