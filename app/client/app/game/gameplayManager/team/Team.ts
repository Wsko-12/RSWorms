import { ELang } from '../../../../../ts/enums';
import { TRemoveEntityCallback } from '../../../../../ts/types';
import Worm from '../../world/entity/worm/Worm';

export default class Team {
    worms: Worm[] = [];
    currentWormIdx = 0;
    index: number;
    name: string;
    maxWorms = 0;
    constructor(index: number, name?: string) {
        this.name = name || 'developers' + index;
        this.index = index;
    }

    pushWorm(worm: Worm) {
        this.maxWorms++;
        this.worms.push(worm);
    }

    getHPLevel() {
        const wormsHp = this.worms.reduce((hp, worm) => (hp += worm.getHPLevel()), 0);
        return wormsHp / this.maxWorms;
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
