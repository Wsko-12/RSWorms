import { Scene } from 'three';
import { EWorldSizes } from '../../../../ts/enums';
import { TLoopCallback } from '../../../../ts/types';
import GameCamera from './camera/GameCamera';
import Renderer from './renderer/Renderer';
import View from './view/View';

export default class GameInterface {
    private view = new View();
    private renderer = new Renderer(this.view.getMainCanvas());
    private camera = new GameCamera();

    public timerElement = this.view.timerElement;
    public windElement = this.view.windElement;
    public inventoryElement = this.view.inventoryElement;
    public teamsHPElement = this.view.teamsHPElement;

    constructor() {
        const eventsHandler = this.view.getMainHandler();
        this.camera.setEventsHandler(eventsHandler);
        this.renderer.setCamera(this.camera.getCamera());
    }
    public buildToDocument() {
        this.view.build();
    }

    public getGameCamera() {
        return this.camera;
    }

    public showInventory(flag: boolean) {
        this.view.showInventory(flag);
    }

    public showWinScreen(teamName?: string) {
        this.view.showWinScreen(teamName);
    }

    public setCameraBorders(x: number, y: number, width: number, height: number) {
        this.camera.setBorders(x, y, width, height);
    }

    public setCameraMaxZoom(worldSize: EWorldSizes) {
        this.camera.setMaxCameraZoom(worldSize);
    }

    public getMainHandler() {
        return this.view.getMainHandler();
    }

    public setMainSceneToRenderer(scene: Scene) {
        this.renderer.setScene(scene);
    }

    public renderLoop: TLoopCallback = () => {
        this.renderer.render();
    };

    public updateLoop: TLoopCallback = (time) => {
        this.camera.update(time);
    };
}
