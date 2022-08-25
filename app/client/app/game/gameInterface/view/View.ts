import './style.scss';
import TImer from './timer/Timer';
import WindInterface from './wind/Wind';
export default class View {
    private mainCanvas = document.createElement('canvas');
    private mainHandler = document.createElement('div');
    private guiContainer = document.createElement('div');
    private timer = new TImer();
    private wind = new WindInterface();

    public timerElement = {
        update: this.timer.update,
        show: this.timer.show,
    };

    public windElement = {
        update: this.wind.update,
    };

    public build() {
        this.mainCanvas.classList.add('main-canvas');
        this.mainHandler.classList.add('main-handler');
        this.guiContainer.classList.add('game-gui-container');

        const timerElement = this.timer.getElement();
        this.guiContainer.append(timerElement);

        const windElement = this.wind.getElement();
        this.guiContainer.append(windElement);

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
