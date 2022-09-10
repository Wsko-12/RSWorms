export default abstract class PageElement {
    protected abstract element: HTMLElement;
    public getElement() {
        return this.element;
    }
}
