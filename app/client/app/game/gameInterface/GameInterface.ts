import { Scene } from 'three';
import { TLoopCallback } from '../../../../ts/types';
import GameCamera from './camera/GameCamera';
import Renderer from './renderer/Renderer';
import View from './view/View';

export default class GameInterface {
    private view = new View();
    private renderer = new Renderer(this.view.getMainCanvas());
    private camera = new GameCamera();

    constructor() {
        this.renderer.setCamera(this.camera.getCamera());
    }
    public buildToDocument() {
        this.view.build();
    }

    public setMainSceneToRenderer(scene: Scene) {
        this.renderer.setScene(scene);
    }

    public renderLoop: TLoopCallback = () => {
        this.renderer.render();
    };
}
