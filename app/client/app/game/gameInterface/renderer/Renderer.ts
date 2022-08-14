import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera | null = null;
    private scene: Scene | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer = new WebGLRenderer({
            canvas,
        });
        this.setSize();

        window.addEventListener('resize', () => {
            this.setSize();
        });
    }

    public setScene(scene: Scene) {
        this.scene = scene;
    }

    public setCamera(camera: PerspectiveCamera) {
        this.camera = camera;
    }

    private setSize(): void {
        const windowPixelRatio = Math.min(window.devicePixelRatio, 2);
        const windowWidth = +window.innerWidth * windowPixelRatio;
        const windowHeight = +window.innerHeight * windowPixelRatio;

        this.renderer.setSize(windowWidth, windowHeight, false);
        this.renderer.setPixelRatio(windowPixelRatio);

        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';

        if (this.camera) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        }

        // if (this._postprocessorManager) {
        //     this._postprocessorManager.setSize(windowWidth, windowHeight);
        // }
    }

    public render() {
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}
