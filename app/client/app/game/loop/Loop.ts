import { TLoopCallback } from '../../../../ts/types';

export default class Loop {
    private _fps: number;
    private _oneFrameTime: number;
    private _listeners: TLoopCallback[] = [];
    private _paused = true;
    private _frame = 0;
    private _timestamp = 0;

    constructor(fps: number, listener?: TLoopCallback, play = false) {
        this._fps = fps;
        this._oneFrameTime = 1 / fps;

        if (listener) {
            this.addListener(listener);
        }

        this._paused = !play;
    }

    public setFps(fps: number) {
        if (fps === 0) {
            this.switcher(false);
            return;
        }
        this._oneFrameTime = 1 / fps;
        this._fps = fps;
    }

    public play(delta: number) {
        if (!this._paused) {
            this._timestamp += delta;
            if (this._timestamp > this._oneFrameTime) {
                this._frame++;
                this._timestamp = this._timestamp % this._oneFrameTime;
                this.call();
            }
        }
    }

    public getFrame() {
        return this._frame;
    }

    public switcher(turnOn: boolean) {
        this._paused = !turnOn;
    }

    public addListener(listener: TLoopCallback) {
        this._listeners.push(listener);
    }

    public removeListener(listener: TLoopCallback) {
        const index = this._listeners.indexOf(listener);
        if (index != -1) {
            this._listeners.splice(index, 1);
        }
    }

    private call() {
        this._listeners.forEach((listener) => {
            listener(this._frame / this._fps);
        });
    }
}
