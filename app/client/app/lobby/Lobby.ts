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
        // const seed = Math.random();
        const seed = 0.6619390924511701;
        console.log('Seed: ', seed);
        this.startGameCallback({
            mapTexturePackName: EMapPacksNames.moon,
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
