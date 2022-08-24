import { ELangs } from '../../../../ts/enums';
import { TRemoveEntityCallback } from '../../../../ts/types';
import Worm from '../world/entity/worm/Worm';

export default class Team {
    worms: Worm[] = [];
    currentWormIdx = 0;
    constructor(
        name: string,
        lang = ELangs.rus,
        quantity = 3,
        wormNames = ['Aleg3000', 'wsko', 'OVERLORD'],
        removeCallback: TRemoveEntityCallback
    ) {
        wormNames.forEach((name) => {
            this.worms.push(new Worm(removeCallback, Math.random() + '', name));
        });
    }

    getNextWorm() {
        if (this.currentWormIdx >= this.worms.length) {
            this.currentWormIdx = 0;
        }
        console.log(this.currentWormIdx)
        return this.worms[this.currentWormIdx++];
    }
}
