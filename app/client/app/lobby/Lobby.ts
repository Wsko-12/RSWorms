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
        // const seed = 0.4884739715122959;

        //worms bug
        //const seed = 0.6469262503466888;
        // const seed = 0.711119400099296;
        // const seed = 0.4743319884630075;
        // const seed = 0.8253192090559442;
        // const seed = 0.2921779319246529;
        // const seed = 0.5464200270095712;
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
            wormsCount: 4,
            multiplayer: false,
            teamNames: ['team-a', 'team-b'],
            playerNames: [],
        });
        // };
        button.innerHTML = 'Start game';
    }
}
