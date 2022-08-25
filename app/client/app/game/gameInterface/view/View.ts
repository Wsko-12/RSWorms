import './style.scss';
import TImer from './timer/Timer';
export default class View {
    private mainCanvas = document.createElement('canvas');
    private mainHandler = document.createElement('div');
    private guiContainer = document.createElement('div');
    private timer = new TImer();

    public timerElement = {
        update: this.timer.update,
        show: this.timer.show,
    };

    public build() {
        this.mainCanvas.classList.add('main-canvas');
        this.mainHandler.classList.add('main-handler');
        this.guiContainer.classList.add('game-gui-container');

        const timerElement = this.timer.getElement();
        this.guiContainer.append(timerElement);

        document.body.append(this.mainCanvas);
        document.body.append(this.mainHandler);
        document.body.append(this.guiContainer);
    }

    public getMainCanvas() {
        return this.mainCanvas;
    }

    public getMainHandler() {
        return this.mainHandler;
    }
}
