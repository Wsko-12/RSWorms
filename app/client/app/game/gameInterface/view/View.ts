import './style.scss';
export default class View {
    private mainCanvas = document.createElement('canvas');
    private mainHandler = document.createElement('div');

    public build() {
        this.mainCanvas.classList.add('main-canvas');
        this.mainHandler.classList.add('main-handler');
        document.body.append(this.mainCanvas);
        document.body.append(this.mainHandler);
    }

    public getMainCanvas() {
        return this.mainCanvas;
    }

    public getMainHandler() {
        return this.mainHandler;
    }
}
