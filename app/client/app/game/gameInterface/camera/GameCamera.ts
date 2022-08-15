import { PerspectiveCamera } from 'three';
import { TLoopCallback } from '../../../../../ts/types';
import { Point3 } from '../../../../utils/geometry';
import CameraController from './controller/CameraController';

export default class GameCamera {
    private camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100, 5000);
    private position = new Point3(0, 0, 5);
    private target = new Point3(0, 0, 0);
    private controller = new CameraController(this.position, this.target);

    public getCamera() {
        return this.camera;
    }

    public setEventsHandler(element: HTMLElement) {
        this.controller.setEventsHandler(element);
    }

    public update: TLoopCallback = (time) => {
        this.controller.update(time);
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.lookAt(this.target.x, this.target.y, this.target.z);
    };
}
