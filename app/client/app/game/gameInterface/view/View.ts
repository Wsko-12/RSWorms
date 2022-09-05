import App from '../../../App';
import Inventory from './inventory/Inventory';
import GameMenu from './menu/GameMenu';
import MobileInterface from './mobile/MobileInterface';
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
    private menu = new GameMenu();
    private inventory = new Inventory();
    private mobileInterface = new MobileInterface(this.mainHandler);

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

        this.guiContainer.append(this.menu.getElement());

        const inventory = this.inventory.getElement();

        const mobileInterface = this.mobileInterface.getElement();
        App.screen.append(mobileInterface);

        App.screen.append(this.mainCanvas);
        App.screen.append(this.mainHandler);
        App.screen.append(this.guiContainer);
        App.screen.append(inventory);
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
