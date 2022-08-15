import { TLoopCallback } from '../../../../../../ts/types';
import { Point3 } from '../../../../../utils/geometry';
import CameraControllerHandler from './CameraControllerHandler';

export default class CameraController {
    private cameraPosition: Point3;
    private cameraTarget: Point3;
    private handler = new CameraControllerHandler(this);
    public speed = 50;
    private smooth = 0.8;

    public borders = {
        setted: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    public zoom = {
        value: 2000,
        max: 2000,
        min: 10,
        delta: 0,
        speed: 1,
    };

    public targetDirection = {
        deltaX: 0,
        deltaY: 0,
    };

    constructor(camPosition: Point3, camTarget: Point3) {
        this.cameraPosition = camPosition;
        this.cameraTarget = camTarget;
        this.cameraTarget.x = 512;
        this.cameraTarget.y = 256;
        this.cameraPosition.z = this.zoom.value;
    }

    public setBorders(x: number, y: number, width: number, height: number) {
        this.borders.setted = true;
        this.borders.x = x;
        this.borders.y = y;
        this.borders.width = width;
        this.borders.height = height;
    }

    private smoothDeltaValue(value: number): number {
        if (value != 0) {
            value *= this.smooth;
            if (value > 0 && value < 0.000005) {
                value = 0;
            }
            if (value < 0 && value > -0.000005) {
                value = 0;
            }
        }
        return value;
    }

    private smoothValues() {
        this.zoom.delta = this.smoothDeltaValue(this.zoom.delta);
        this.targetDirection.deltaX = this.smoothDeltaValue(this.targetDirection.deltaX);
        this.targetDirection.deltaY = this.smoothDeltaValue(this.targetDirection.deltaY);
    }

    public setEventsHandler(element: HTMLElement) {
        this.handler.setEventsHandler(element);
    }

    public update: TLoopCallback = (time) => {
        this.zoomCamera();
        this.moveTarget();
        this.moveCamera();
        this.smoothValues();
    };

    private moveTarget() {
        this.cameraTarget.x += this.targetDirection.deltaX * this.speed * (this.zoom.value / 100);
        this.cameraTarget.y += this.targetDirection.deltaY * this.speed * (this.zoom.value / 100);

        if (this.borders.setted) {
            if (this.cameraTarget.x > this.borders.x + this.borders.width) {
                this.cameraTarget.x = this.borders.x + this.borders.width;
            }
            if (this.cameraTarget.x < this.borders.x) {
                this.cameraTarget.x = this.borders.x;
            }

            if (this.cameraTarget.y > this.borders.y + this.borders.height) {
                this.cameraTarget.y = this.borders.y + this.borders.height;
            }
            if (this.cameraTarget.y < this.borders.y) {
                this.cameraTarget.y = this.borders.y;
            }
        }
    }

    private moveCamera() {
        this.cameraPosition.x = this.cameraTarget.x;
        this.cameraPosition.y = this.cameraTarget.y;
    }

    private zoomCamera() {
        this.zoom.value += this.zoom.delta * this.zoom.speed;
        this.cameraPosition.z = this.zoom.value;
        if (this.zoom.value > this.zoom.max) {
            this.zoom.value = this.zoom.max;
        }
        if (this.zoom.value < this.zoom.min) {
            this.zoom.value = this.zoom.min;
        }
    }
}
