export default class View {
    private mainCanvas = document.createElement('canvas');
    private mainHandler = document.createElement('div');

    public build() {
        document.body.append(this.mainCanvas);
    }

    public getMainCanvas() {
        return this.mainCanvas;
    }

    public getMainHandler() {
        return this.mainHandler;
    }
}
