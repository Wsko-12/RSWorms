import CameraController from './CameraController';

export default class CameraControllerHandler {
    private controller: CameraController;
    private handleElement: HTMLElement | null = null;

    private mouse = {
        x: 0,
        y: 0,
        clicked: {
            x: 0,
            y: 0,
            flag: false,
            moved: false,
            timestamp: 0,
        },
        context: {
            x: 0,
            y: 0,
            flag: false,
            moved: false,
            timestamp: 0,
        },
    };

    private touch = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        clicked: false,
        double: true,
        moved: false,
        timestamp: 0,
    };

    private contextmenu: (e: MouseEvent) => boolean;
    private wheel: (e: WheelEvent) => void;

    private mouseDown: (e: MouseEvent) => void;
    private mouseMove: (e: MouseEvent) => void;
    private mouseUp: (e: MouseEvent) => void;

    // private touchStart: (e: TouchEvent) => void;
    // private touchMove: (e: TouchEvent) => void;
    // private touchEnd: (e: TouchEvent) => void;

    constructor(controller: CameraController) {
        this.controller = controller;

        this.contextmenu = (e: MouseEvent): boolean => {
            e.preventDefault();
            return false;
        };

        this.wheel = (e: WheelEvent): void => {
            e.preventDefault();
            const { deltaX, deltaY } = e;
            if (deltaY !== 0) {
                if (deltaY % 1 === 0) {
                    if (deltaY === 100 || deltaY === -100) {
                        if (deltaY > 0) {
                            //mouse wheel
                            this.controller.zoom.delta += 0.1 * this.controller.speed;
                        } else {
                            //mouse wheel
                            this.controller.zoom.delta -= 0.1 * this.controller.speed;
                        }
                    } else {
                        //trackpad two fingers move
                        this.controller.targetDirection.deltaY += (-e.deltaY / window.innerHeight) * 0.25;
                    }
                } else {
                    //pitch
                    this.controller.zoom.delta += deltaY * this.controller.speed * 0.01;
                }
            }

            if (deltaX !== 0) {
                this.controller.targetDirection.deltaX += (e.deltaX / window.innerWidth) * 0.25;
            }
        };

        this.mouseDown = (e: MouseEvent): void => {
            e.preventDefault();
            if (e.button === 0) {
                this.mouse.clicked.x = e.clientX;
                this.mouse.clicked.y = e.clientY;
                this.mouse.clicked.flag = true;
                this.mouse.clicked.timestamp = e.timeStamp;
            }
            if (e.button === 2) {
                this.mouse.context.x = e.clientX;
                this.mouse.context.y = e.clientY;
                this.mouse.context.flag = true;
                this.mouse.context.timestamp = e.timeStamp;
            }
        };

        this.mouseMove = (e: MouseEvent): void => {
            e.preventDefault();
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            // const event = CameraEventsHandler.createPointerEvent(ECustomEvents.mouseMove, [e.clientX, e.clientY]);
            // this._eventHandler?.dispatchEvent(event);

            if (this.mouse.clicked.flag) {
                let deltaX = e.clientX - this.mouse.clicked.x;
                let deltaY = e.clientY - this.mouse.clicked.y;

                this.mouse.clicked.x = e.clientX;
                this.mouse.clicked.y = e.clientY;

                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    this.mouse.clicked.moved = true;
                }

                deltaX /= window.innerWidth;
                deltaY /= window.innerHeight;

                this.controller.targetDirection.deltaX = -deltaX * 10;
                this.controller.targetDirection.deltaY = deltaY * 10;
            }

            if (this.mouse.context.flag) {
                this.mouse.context.moved = true;

                let deltaX = e.clientX - this.mouse.context.x;
                let deltaY = e.clientY - this.mouse.context.y;

                this.mouse.context.x = e.clientX;
                this.mouse.context.y = e.clientY;

                if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                    this.mouse.context.moved = true;
                }

                deltaX /= window.innerWidth;
                deltaY /= window.innerHeight;

                // this.controller.cameraAngles.deltaAlpha += deltaX * this._controller.speed;
                // this.controller.cameraAngles.deltaTetha += deltaY * this._controller.speed;
            }
        };

        this.mouseUp = (e: MouseEvent): void => {
            e.preventDefault();
            if (e.button === 0) {
                if (e.timeStamp - this.mouse.clicked.timestamp < 150 && !this.mouse.clicked.moved) {
                    //click
                    // const event = CameraEventsHandler.createPointerEvent(ECustomEvents.click, [e.clientX, e.clientY]);
                    // this._eventHandler?.dispatchEvent(event);
                }
                this.mouse.clicked.flag = false;
                this.mouse.clicked.moved = false;
            }
            if (e.button === 2) {
                if (e.timeStamp - this.mouse.context.timestamp < 150 && !this.mouse.context.moved) {
                    // context click
                }
                this.mouse.context.flag = false;
                this.mouse.context.moved = false;
            }
            if (e.type === 'mouseleave') {
                this.mouse.clicked.flag = false;
                this.mouse.context.flag = false;
            }
        };

        // this.touchStart = (e: TouchEvent): void => {
        //     e.preventDefault();
        //     this.touch.timestamp = e.timeStamp;
        //     this.touch.x = e.touches[0].clientX;
        //     this.touch.y = e.touches[0].clientY;
        //     if (e.touches.length === 1) {
        //         this.touch.clicked = true;
        //         this.touch.double = false;
        //     }
        //     if (e.touches.length > 1) {
        //         this.touch.clicked = false;
        //         this.touch.double = true;
        //         this.touch.x2 = e.touches[1].clientX;
        //         this.touch.y2 = e.touches[1].clientY;
        //     }
        // };
    }

    public setEventsHandler(element: HTMLElement) {
        this.handleElement = element;
        this.attachEvents();
    }

    private attachEvents() {
        if (this.handleElement) {
            this.handleElement.addEventListener('contextmenu', this.contextmenu);
            this.handleElement.addEventListener('wheel', this.wheel);

            this.handleElement.addEventListener('mousedown', this.mouseDown);
            this.handleElement.addEventListener('mousemove', this.mouseMove);
            this.handleElement.addEventListener('mouseup', this.mouseUp);
            this.handleElement.addEventListener('mouseleave', this.mouseUp);

            // this.handleElement.addEventListener('touchmove', this.touchMove);
            // this.handleElement.addEventListener('touchstart', this.touchStart);
            // this.handleElement.addEventListener('touchend', this.touchEnd);
        }
    }
}
