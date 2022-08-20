import { EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../ts/enums';
import { TStartGameCallback } from '../../../ts/types';

export default class Lobby {
    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;
    }
    public start() {
        const button = document.createElement('button');
        document.body.append(button);
        // button.onclick = () => {
        document.body.innerHTML = '';
        const seed = Math.random();
        // const seed = 0.7135371756374531;
        // const seed = 0.7972989657842342;
        // const seed = 0.7190317696597344;
        console.log('Seed: ', seed);
        this.startGameCallback({
            mapTexturePackName: EMapPacksNames.candy,
            worldSize: EWorldSizes.medium,
            seed,
            decor: {
                count: EMapPacksDecorItems[EMapPacksNames.moon],
                max: 6,
                min: 2,
            },
        });
        // };
        button.innerHTML = 'Start game';
    }
}
