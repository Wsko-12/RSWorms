import { PerspectiveCamera } from 'three';
import { EConstants, EWorldSizes } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import { Point2, Point3 } from '../../../../utils/geometry';
import CameraController from './controller/CameraController';

export default class GameCamera {
    private camera = new PerspectiveCamera(EConstants.cameraFov, window.innerWidth / window.innerHeight, 1, 5000);
    private position = new Point3(0, 0, 5);
    private target = new Point3(0, 0, 0);
    private controller = new CameraController(this.position, this.target);

    public getCamera() {
        return this.camera;
    }

    public setEventsHandler(element: HTMLElement) {
        this.controller.setEventsHandler(element);
    }

    public setBorders(x: number, y: number, width: number, height: number) {
        this.controller.setBorders(x, y, width, height);
    }

    public setMaxCameraZoom(worldSize: EWorldSizes) {
        this.camera.far = worldSize * 2;
        this.camera.updateProjectionMatrix();
        this.controller.setMaxCameraZoom(worldSize);
    }

    public update: TLoopCallback = (time) => {
        this.controller.update(time);
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.lookAt(this.target.x, this.target.y, this.target.z);
    };

    public moveTo(point: Point2) {
        this.controller.moveTo(point);
    }
}
