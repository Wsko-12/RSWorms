import Arsenal from './arsenal/Arsenal';
import './style.scss';
import TeamsHP from './teamHP/TeamHP';
import TimerInterface from './timer/Timer';
import WindInterface from './wind/Wind';
export default class View {
    private mainCanvas = document.createElement('canvas');
    private mainHandler = document.createElement('div');
    private guiContainer = document.createElement('div');
    private timer = new TimerInterface();
    private wind = new WindInterface();
    private teamsHP = new TeamsHP();
    // private arsenal = new Arsenal();

    public timerElement = {
        update: this.timer.update,
        show: this.timer.show,
    };

    public teamsHPElement = {
        build: this.teamsHP.build,
        update: this.teamsHP.update,
    };

    public windElement = {
        update: this.wind.update,
    };

    // public arsenalElement = {
    //     setChooseWeaponCallback: this.arsenal.setChooseWeaponCallback,
    // };

    public build() {
        this.mainCanvas.classList.add('main-canvas');
        this.mainHandler.classList.add('main-handler');
        this.guiContainer.classList.add('game-gui-container');

        const timerElement = this.timer.getElement();
        this.guiContainer.append(timerElement);

        const windElement = this.wind.getElement();
        this.guiContainer.append(windElement);

        const teamsHPElement = this.teamsHP.getElement();
        this.guiContainer.append(teamsHPElement);

        document.body.append(this.mainCanvas);
        document.body.append(this.mainHandler);
        document.body.append(this.guiContainer);
    }

    // public renderArsenal(weapons: string[]) {
    //     this.arsenal.renderArs(weapons);
    // }

    public getMainCanvas() {
        return this.mainCanvas;
    }

    public getMainHandler() {
        return this.mainHandler;
    }
}
