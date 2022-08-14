import { PerspectiveCamera } from 'three';

export default class GameCamera {
    private camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    constructor() {
        this.camera.position.z = 5;
        this.camera.lookAt(0, 0, 0);
    }
    public getCamera() {
        return this.camera;
    }
}
