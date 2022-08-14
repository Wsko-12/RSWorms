import { IGameStartProps } from '../../../ts/interfaces';

export default class Lobby {
    private startGameFunc: (gameProps: IGameStartProps) => void;
    constructor(startGameFunc: (gameProps: IGameStartProps) => void) {
        this.startGameFunc = startGameFunc;
    }
    public start() {
        const button = document.createElement('button');
        button.onclick = () => {
            document.body.innerHTML = '';
            this.startGameFunc({});
        };
        button.innerHTML = 'Start game';
        document.body.append(button);
    }
}
