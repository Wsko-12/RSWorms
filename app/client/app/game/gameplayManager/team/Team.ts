import { ELang } from '../../../../../ts/enums';
import Worm from '../../world/entity/worm/Worm';
import Arsenal from '../../gameInterface/view/arsenal/Arsenal';

export default class Team {
    worms: Worm[] = [];
    currentWormIdx = 0;
    index: number;
    name: string;
    maxWorms = 0;
    arsenal: Arsenal;
    public weapons = ['bazooka', 'grenade', 'dynamite', 'mine'];
    constructor(index: number, name?: string) {
        this.name = name || 'developers' + index;
        this.index = index;
        this.arsenal = new Arsenal(this.weapons);
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
