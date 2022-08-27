import Inventory from './inventory/Inventory';
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
    private inventory = new Inventory();

    public timerElement = {
        update: this.timer.update,
        show: this.timer.show,
    };

    public teamsHPElement = {
        update: this.teamsHP.update,
    };

    public windElement = {
        update: this.wind.update,
    };

    public inventoryElement = {
        setChooseWeaponCallback: this.inventory.setChooseWeaponCallback,
    };

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

        const inventory = this.inventory.getElement();

        document.body.append(this.mainCanvas);
        document.body.append(this.mainHandler);
        document.body.append(this.guiContainer);
        document.body.append(inventory);
    }

    public showInventory(flag: boolean) {
        this.inventory.show(flag);
    }

    public getMainCanvas() {
        return this.mainCanvas;
    }

    public getMainHandler() {
        return this.mainHandler;
    }
}
