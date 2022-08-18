import { Point2 } from '../../../../../utils/geometry';

export default class MapMatrix {
    public matrix: number[][];
    private canvas = this.createCanvas();
    private updateMapMaskTextureCallback: () => void;
    constructor(matrix: number[][] = [[]], updateMapMaskTextureCallback: () => void) {
        this.matrix = matrix;
        this.updateMapMaskTextureCallback = updateMapMaskTextureCallback;
    }

    public setMatrix(matrix: number[][]) {
        this.matrix = matrix;
        const width = matrix[0].length;
        const height = matrix.length;

        const canvas = this.canvas.element;
        canvas.width = width;
        canvas.height = height;

        const { ctx } = this.canvas;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        this.updateMapMaskTextureCallback();
    }

    public getCanvasElement() {
        return this.canvas.element;
    }

    private createCanvas() {
        const element = document.createElement('canvas');

        const ctx = element.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            return { element, ctx };
        } else {
            throw new Error("[WordMap createCanvas]: can't receive canvas ctx");
        }
    }

    public destroy(point: Point2, r: number) {
        const { ctx } = this.canvas;
        ctx.fillStyle = 'black';
        const { matrix } = this;
        const height = matrix.length;

        const iX = Math.floor(point.x);
        const iY = Math.floor(point.y);

        const roundedRadius = Math.round(r / 2);

        for (let y = iY - roundedRadius; y < iY + roundedRadius; y++) {
            for (let x = iX - roundedRadius; x < iX + roundedRadius; x++) {
                const dist = point.getDistanceToPoint(new Point2(x, y));
                if (dist <= roundedRadius) {
                    if (matrix[y] && matrix[y][x]) {
                        matrix[y][x] = 0;
                    }
                    ctx.fillRect(x, height - y, 1, 1);
                }
            }
        }

        this.updateMapMaskTextureCallback();
    }
}
