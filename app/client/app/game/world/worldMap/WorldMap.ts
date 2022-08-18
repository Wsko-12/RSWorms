import { Mesh, MeshBasicMaterial, NearestFilter, Object3D, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ, EProportions } from '../../../../../ts/enums';
import { IStartGameOptions } from '../../../../../ts/interfaces';
import Perlin from '../../../../utils/p5/Perlin';
import Random from '../../../../utils/Random';
import AssetsManager from '../../assetsManager/AssetsManager';
import { Place, x, xy } from './interfaces';

export default class WorldMap {
    private object3D: Object3D | null = null;
    private canvas = this.createCanvas();
    private random = new Random();
    private renderedMap: HTMLImageElement | null = null;
    private mapMatrix: number[][] = [[]];
    private sizes = {
        world: 0,
        width: 0,
        height: 0,
    };

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

    public async init(options: IStartGameOptions) {
        Perlin.noiseSeed(options.seed * 1000000);
        this.random = new Random(options.seed);

        const canvas = this.canvas.element;
        const width = options.worldSize * EProportions.mapWidthToHeight;
        const height = options.worldSize;

        this.sizes = {
            world: options.worldSize,
            width,
            height,
        };
        canvas.width = width;
        canvas.height = height;

        await this.createWorld(options);
        if (!this.renderedMap) {
            throw new Error("[WorldMap init] can't receive rendered map");
        }

        const geometry = new PlaneBufferGeometry(width, height);
        const texture = new Texture(this.renderedMap);

        // to disable pixels and create more smooth disable next line
        texture.magFilter = NearestFilter;

        texture.needsUpdate = true;
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });
        const object = new Mesh(geometry, material);
        object.position.set(width / 2, height / 2, ELayersZ.map);
        this.object3D = object;
        return true;
    }

    public getObject3D() {
        return this.object3D;
    }

    public getSizes() {
        return { ...this.sizes };
    }

    public getMapMatrix() {
        return this.mapMatrix;
    }

    private clearCanvas() {
        const { ctx, element } = this.canvas;
        ctx.clearRect(0, 0, element.width, element.height);
    }

    private imageDataToMatrix(data: Uint8ClampedArray, width: number, height: number) {
        const pixels = [];
        for (let i = 3; i < data.length; i += 4) {
            pixels.push(data[i] === 255 ? 1 : 0);
        }

        const matrix: number[][] = [];
        let index = 0;
        for (let y = 0; y < height; y++) {
            matrix.push([]);
            for (let x = 0; x < width; x++) {
                matrix[y][x] = pixels[index];
                index += 1;
            }
        }
        return matrix;
    }

    private createWorld(options: IStartGameOptions) {
        return new Promise((mapCreated) => {
            const { ctx, element } = this.canvas;
            const width = options.worldSize * EProportions.mapWidthToHeight;
            const height = options.worldSize;
            this.clearCanvas();
            this.drawBaseMaskMatrix(ctx, width, height);

            const maskData = ctx.getImageData(0, 0, width, height).data;
            let maskMatrix = this.imageDataToMatrix(maskData, width, height);

            // balki start

            const potentialPlaces = this.findPlacesForBridge(maskMatrix);
            const place = this.findPlace(potentialPlaces);
            maskMatrix = this.addBridgeToMaskMatrix(maskMatrix, potentialPlaces, place);

            //balki end

            this.clearCanvas();

            this.drawGroundPattern(ctx, width, height);

            this.clipGroundPatternByMatrix(ctx, maskMatrix);

            const groundImageUrl = element.toDataURL();
            const groundImage = new Image();
            groundImage.src = groundImageUrl;

            groundImage.onload = () => {
                this.clearCanvas();

                this.drawDecorObjects(ctx, maskMatrix, options, width, height);

                ctx.drawImage(groundImage, 0, 0, width, height);

                this.drawGrass(ctx, maskMatrix);

                const mapData = ctx.getImageData(0, 0, width, height).data;
                const mapMatrix = this.imageDataToMatrix(mapData, width, height).reverse();
                this.mapMatrix = mapMatrix;

                this.drawBridge(ctx, width, height, maskMatrix);

                const mapRenderURl = element.toDataURL();
                this.renderedMap = new Image();

                this.renderedMap.src = mapRenderURl;
                this.renderedMap.onload = () => {
                    mapCreated(true);
                };
            };
        });
    }

    private drawBaseMaskMatrix(ctx: CanvasRenderingContext2D, width: number, height: number) {
        //return matrix with 0 and 1 only like black and transparent mask
        ctx.fillStyle = 'black';

        const d = 512;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let shift = 1;
                const main = Perlin.noise((x * shift) / d, (y * shift) / d) > 0.5 ? 1 : 0;
                if (main) {
                    ctx.fillRect(x, y, 1, 1);
                }

                shift++;

                //add bottom
                // in bottom third
                if (y > height - height / 3) {
                    const bottom = Perlin.noise((x * shift) / (d * 2));
                    const yBottomThird = (y - (height - height / 3)) / (height / 3);
                    if (yBottomThird > bottom) {
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
                shift++;

                //remove top
                if (y < height / 2) {
                    const top = Perlin.noise((x * shift) / (d * 3));

                    const yTopThird = y / (height / 2);
                    if (yTopThird < top) {
                        ctx.clearRect(x, y, 1, 1);
                    }
                }
                shift++;
                //remove left
                if (x < width / 4) {
                    const left = Perlin.noise((y * shift) / (d * 3));

                    const xLeft = x / (width / 4);
                    if (xLeft < left) {
                        ctx.clearRect(x, y, 1, 1);
                    }
                }
                shift++;
                // remove right
                if (x > width - width / 4) {
                    const right = Perlin.noise((y * shift) / (d * 3));

                    const xRight = (x - (width - width / 3)) / (width / 3);
                    if (xRight > right) {
                        ctx.clearRect(x, y, 1, 1);
                    }
                }
            }
        }
    }

    private drawBridge(ctx: CanvasRenderingContext2D, width: number, height: number, matrix: number[][]) {
        const image = AssetsManager.getMapTexture('ground');
        if (!image) {
            throw new Error("[WorldMap drawGroundPattern] can't receive ground texture");
        }
        const iWidth = image.width;
        const iHeight = image.width;

        for (let y = 0; y < height; y += iHeight) {
            for (let x = 0; x < width; x += iWidth) {
                if (matrix[y][x] === 2) ctx.drawImage(image, x, y, 1, 1);
            }
        }
    }

    private drawGroundPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
        const image = AssetsManager.getMapTexture('ground');
        if (!image) {
            throw new Error("[WorldMap drawGroundPattern] can't receive ground texture");
        }
        const iWidth = image.width;
        const iHeight = image.width;

        for (let y = 0; y < height; y += iHeight) {
            for (let x = 0; x < width; x += iWidth) {
                ctx.drawImage(image, x, y, iWidth, iHeight);
            }
        }
    }

    private drawGrass(ctx: CanvasRenderingContext2D, matrix: number[][]) {
        const image = AssetsManager.getMapTexture('grass');
        if (!image) {
            throw new Error(`[WorldMap drawGrass] can't receive grass texture`);
        }

        const size = image.width;

        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                const current = matrix[y][x];
                if (current === 1) {
                    const top = matrix[y - 1][x];

                    if (top === 0) {
                        ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
                    }
                }
            }
        }
    }

    private clipGroundPatternByMatrix(ctx: CanvasRenderingContext2D, matrix: number[][]) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x] === 0) {
                    ctx.clearRect(x, y, 1, 1);
                }
            }
        }
    }

    private drawDecorObjects(
        ctx: CanvasRenderingContext2D,
        matrix: number[][],
        options: IStartGameOptions,
        width: number,
        height: number
    ) {
        const r = this.random;
        let objCount = Math.round(options.decor.max * r.get());
        objCount += options.decor.min;
        if (objCount > options.decor.max) {
            objCount = options.decor.max;
        }

        const objects: number[] = [];
        for (let i = 0; i < objCount; i++) {
            const objIndex = Math.floor(options.decor.count * r.get()) + 1;

            objects.push(objIndex);
        }

        const drawObject = (objIndex: number, x: number, y: number) => {
            const name = 'decor' + objIndex;
            const image = AssetsManager.getMapTexture(name);
            if (!image) {
                throw new Error(`[WorldMap drawDecorObjects] can't receive decor texture: ${name}`);
            }
            const iWidth = image.width;
            const iHeight = image.height;
            ctx.drawImage(image, x - iWidth / 2, y - iHeight + iHeight / 4, iWidth, iHeight);
        };

        objects.forEach((objIndex) => {
            const place = this.getObjectPlace(matrix, width, height);
            drawObject(objIndex, place.x, place.y);
        });
    }

    public getObjectPlace = (matrix = this.mapMatrix, width = 0, height = 0, attempt = 5): { x: number; y: number } => {
        if (!width && this.sizes) {
            width = this.sizes.width;
            height = this.sizes.height;
        }

        const rand = this.random.get();
        //divide map by parts;
        const parts = 32;
        const partSize = width / parts;
        const part = Math.floor((parts - 8) * rand) + 4;
        const x = part * partSize;

        let skips = Math.round(this.random.get());
        if (attempt <= 0) {
            skips = 0;
        }
        let skipped = 0;
        let prevSkipped = false;

        for (let y = 0; y < height; y++) {
            const cell = matrix[y][x];
            if (cell === 0 || cell === 2) {
                prevSkipped = false;
            }

            if (cell === 1) {
                if (skipped === skips && !prevSkipped) {
                    // check for bridge
                    // let canDrop = true;
                    // for (let i = 0; i <= 100 /*  here will be obj height */; i++) {
                    //     const pointToCheck = matrix[y - 10 - i][x];
                    //     if (pointToCheck === 2 || pointToCheck === 1) canDrop = false;
                    // }
                    // if (canDrop) return { x, y };
                    // else return null;
                    return { x, y };
                } else {
                    if (!prevSkipped) {
                        prevSkipped = true;
                        skipped++;
                    }
                }
            }
        }

        return this.getObjectPlace(matrix, width, height, attempt - 1);
    };

    private addBridgeToMaskMatrix(
        matrix: number[][],
        potentialPlaces: (Place | undefined)[],
        place: { y: { start: number | undefined; end: number; height: number } } | null | undefined
    ): number[][] {
        if (potentialPlaces.length === 0 || !potentialPlaces[0] || !place) return matrix;
        const yStart = place?.y?.start || 0 + 50; /* bridge step */
        const i = potentialPlaces.findIndex((el: Place | undefined) => el?.y === yStart);
        if (i === -1) return matrix;
        const placeForBridge = potentialPlaces[i];
        const xStart = placeForBridge?.x.start || 0;
        const xWidth = placeForBridge?.x.width || 0;
        // console.log(xStart, yStart, xWidth);
        const bWidth = 50; /* bridge step */
        const bHeight = 10; /* bridge height*/
        for (let i = 0; i <= bWidth; i++) {
            for (let a = 0; a <= bHeight; a++) {
                matrix[yStart - i - a][xStart + i] = 2;
                matrix[yStart - i - a][xStart + xWidth - i] = 2;
            }
        }
        const width = xWidth - bWidth * 2;
        for (let i = 0; i <= bHeight; i++) {
            matrix[yStart - bWidth - i].splice(xStart + bWidth, width, ...new Array(width).fill(2));
        }
        return matrix;
    }

    // bridge create

    private findPlacesForBridge(matrix: number[][]) {
        return matrix
            .map((el: number[], index: number) => {
                const arrX: x[] = [];
                let start = 1;
                let end = 1;
                for (let i = 0; i <= el.length; i++) {
                    if (el[i] === el[i + 1]) {
                        continue;
                    } else {
                        end = i;
                        const width: number = end - start;
                        arrX.push({ type: el[i], xStart: start, xEnd: end, width });
                        start = i + 1;
                    }
                }
                return { y: index, x: arrX };
            })
            .filter((el: xy): boolean => el.x.length >= 5)
            .map((el: xy) => {
                el.x = el.x.slice(1, -1);
                return el;
            })
            .map((el: xy) => {
                const index: number = el.x.findIndex((j: x) => j.width > 500 /* min width for bridge*/ && j.type === 0);
                if (index === -1) return null;
                el.x = el.x.slice(index, index + 1);
                return el;
            })
            .filter((el: xy | null) => !!el)
            .map((el: xy | null /* idk why but ts want*/) => {
                if (el)
                    return {
                        y: el.y,
                        x: {
                            start: el.x[0].xStart,
                            end: el.x[0].xEnd,
                            width: el.x[0].width,
                        },
                    };
            });
    }

    private findPlace(allPlaces: (Place | undefined)[]) {
        if (allPlaces.length === 0) return;
        let places = [];
        let start = allPlaces[0]?.y;
        let height = 1;
        for (let i = 0; i < allPlaces.length - 1; i++) {
            const currentPoint = allPlaces[i]?.y || 0;
            const nextPoint = allPlaces[i + 1]?.y;
            if (currentPoint + 1 !== nextPoint || i === allPlaces.length - 2) {
                const end = currentPoint;
                places.push({ y: { start, end, height } });
                start = allPlaces[i + 1]?.y;
                height = 1;
            } else height++;
        }
        // ищем долину с высотой хотя бы 300 и возвращаем самую верхнюю, потом можно дописать и создавать несколько балок
        places = places.filter((el) => el.y.height > 50);
        if (places[0]?.y?.start) return places[0];
        else return null;
    }
}
