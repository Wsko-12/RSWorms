import { EMapPacksNames, EWorldSizes } from '../../../ts/enums';
import { TStartGameCallback } from '../../../ts/types';

export default class Lobby {
    private startGameCallback: TStartGameCallback;
    constructor(startGameCallback: TStartGameCallback) {
        this.startGameCallback = startGameCallback;
    }
    public start() {
        const button = document.createElement('button');
        button.onclick = () => {
            document.body.innerHTML = '';
            this.startGameCallback({
                mapTexturePackName: EMapPacksNames.moon,
                worldSize: EWorldSizes.big,
            });
        };
        button.innerHTML = 'Start game';
        document.body.append(button);
    }
}
