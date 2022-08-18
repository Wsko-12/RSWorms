import { EConstants, EWorldSizes } from '../../../../../../ts/enums';
import { TLoopCallback } from '../../../../../../ts/types';
import { Point2, Point3, Vector2 } from '../../../../../utils/geometry';
import CameraControllerHandler from './CameraControllerHandler';

export default class CameraController {
    private cameraPosition: Point3;
    private cameraTarget: Point3;
    private handler = new CameraControllerHandler(this);
    public targetSpeed = 50;
    private smooth = 0.8;

    public borders = {
        setted: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        worldSize: EWorldSizes.small,
    };

    public zoom = {
        value: EWorldSizes.small,
        max: EWorldSizes.small,
        min: 150,
        delta: 0,
        speed: 1,
    };

    public targetDirection = {
        deltaX: 0,
        deltaY: 0,
    };

    private targetPoint: Point2 | null = null;

    constructor(camPosition: Point3, camTarget: Point3) {
        this.cameraPosition = camPosition;
        this.cameraTarget = camTarget;
        this.cameraTarget.x = 512;
        this.cameraTarget.y = 256;
        this.cameraPosition.z = this.zoom.value;

        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyC') {
                this.moveTo(new Point2(0, 0));
            }
        });
    }

    public setMaxCameraZoom(worldSize: EWorldSizes) {
        this.zoom.value = worldSize;
        this.zoom.max = worldSize;
        this.borders.worldSize = worldSize;
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

    public update: TLoopCallback = () => {
        this.zoomCamera();
        this.moveTarget();
        this.moveCamera();
        this.smoothValues();
    };

    private moveTarget() {
        if (!this.targetPoint || this.targetDirection.deltaX || this.targetDirection.deltaY) {
            this.targetPoint = null;
            this.cameraTarget.x += this.targetDirection.deltaX * this.targetSpeed * (this.zoom.value / 100);
            this.cameraTarget.y += this.targetDirection.deltaY * this.targetSpeed * (this.zoom.value / 100);
        } else {
            const x = this.targetPoint.x - this.cameraTarget.x;
            const y = this.targetPoint.y - this.cameraTarget.y;
            const vec = new Vector2(x, y);
            const length = vec.getLength();
            const smooth = 0.25;
            vec.scale(smooth);

            if (length > smooth) {
                this.cameraTarget.x += vec.x;
                this.cameraTarget.y += vec.y;
            } else {
                this.cameraTarget.x = this.targetPoint.x;
                this.cameraTarget.y = this.targetPoint.y;
                this.targetPoint = null;
            }
        }

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

        const minY = this.zoom.value * Math.tan((EConstants.cameraFov / 2) * (Math.PI / 180));

        if (this.cameraTarget.y < minY) {
            this.cameraTarget.y = minY;
        }
    }

    private moveCamera() {
        const vec = new Vector2(
            this.cameraTarget.x - this.cameraPosition.x,
            this.cameraTarget.y - this.cameraPosition.y
        );

        const length = vec.getLength();
        if (length > 1) {
            vec.normalize().scale(length * 0.2);
            this.cameraPosition.x += vec.x;
            this.cameraPosition.y += vec.y;
        } else {
            this.cameraPosition.x = this.cameraTarget.x;
            this.cameraPosition.y = this.cameraTarget.y;
        }
    }

    private zoomCamera() {
        this.zoom.value += this.zoom.delta * this.zoom.speed;
        if (this.zoom.value > this.zoom.max) {
            this.zoom.value = this.zoom.max;
        }
        if (this.zoom.value < this.zoom.min) {
            this.zoom.value = this.zoom.min;
        }

        this.cameraPosition.z = this.zoom.value;
    }

    public moveTo(point: Point2) {
        this.targetDirection.deltaX = 0;
        this.targetDirection.deltaY = 0;
        this.targetPoint = point;
    }
}
