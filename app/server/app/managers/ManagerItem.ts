export default abstract class ManagerItem {
    private removeFromManagerCb: ((item: ManagerItem) => void) | null = null;

    public setRemoveFromManagerCb(cb: (item: ManagerItem) => void) {
        this.removeFromManagerCb = cb;
    }

    public removeFromManager() {
        if (this.removeFromManagerCb) {
            this.removeFromManagerCb(this);
            this.removeFromManagerCb = null;
        }
    }
}
