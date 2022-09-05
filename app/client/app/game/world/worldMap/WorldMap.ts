import { CanvasTexture, Mesh, MeshBasicMaterial, NearestFilter, Object3D, PlaneBufferGeometry, Texture } from 'three';
import { ELayersZ, EProportions, ESizes } from '../../../../../ts/enums';
import { IStartGameOptions } from '../../../../../ts/interfaces';
import { Point2 } from '../../../../utils/geometry';
import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import Perlin from '../../../../utils/p5/Perlin';
import Random from '../../../../utils/Random';
import AssetsManager from '../../assetsManager/AssetsManager';
import Entity from '../entity/Entity';
import MapMatrix from './mapMatrix/MapMatrix';

export default class WorldMap {
    private object3D: Object3D | null = null;
    private canvas = this.createCanvas();
    private random = new Random();
    private renderedMap: HTMLImageElement | null = null;
    private updateMapMaskTexture = () => {
        this.maskTexture.needsUpdate = true;
    };

    private mapMatrix = new MapMatrix([[]], this.updateMapMaskTexture);
    private maskTexture = new CanvasTexture(this.mapMatrix.getCanvasElement());

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
        const width = options.size * EProportions.mapWidthToHeight;
        const height = options.size;

        this.sizes = {
            world: options.size,
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
        this.maskTexture.magFilter = NearestFilter;

        texture.needsUpdate = true;
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
            alphaMap: this.maskTexture,
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
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (mapCreated) => {
            const { ctx, element } = this.canvas;
            const width = options.size * EProportions.mapWidthToHeight;
            const height = options.size;
            this.clearCanvas();
            await this.drawBaseMaskMatrix(ctx, width, height);

            const maskData = ctx.getImageData(0, 0, width, height).data;
            const maskMatrix = this.imageDataToMatrix(maskData, width, height);

            this.clearCanvas();

            await this.drawGroundPattern(ctx, width, height);
            await this.clipGroundPatternByMatrix(ctx, maskMatrix);

            const groundImageUrl = element.toDataURL();
            const groundImage = new Image();
            groundImage.src = groundImageUrl;

            groundImage.onload = async () => {
                this.clearCanvas();
                this.drawDecorObjects(ctx, maskMatrix, options, width, height);
                ctx.drawImage(groundImage, 0, 0, width, height);

                await this.drawGrass(ctx, maskMatrix);

                const mapData = ctx.getImageData(0, 0, width, height).data;
                const mapMatrix = this.imageDataToMatrix(mapData, width, height).reverse();
                this.mapMatrix.setMatrix(mapMatrix);

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
        const stepMax = 32;
        const loading = LoadingPage.start('Generating Map. Matrix', stepMax);

        const partsInStep = height / stepMax;
        let step = 0;
        return new Promise((res) => {
            ctx.fillStyle = 'black';
            const d = 512;
            function generatePart() {
                for (let i = 0; i < partsInStep; i++) {
                    const y = i + partsInStep * step;
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
                            const xRight = (x - (width - width / 8)) / (width / 8);
                            if (xRight > right) {
                                ctx.clearRect(x, y, 1, 1);
                            }
                        }
                        // if(y === 200){
                        //     ctx.fillRect(x, y, 1, 1);
                        // }
                    }
                }

                if (step < stepMax - 1) {
                    step++;
                    loading.setCurrent(step);
                    setTimeout(() => {
                        generatePart();
                    });
                } else {
                    loading.done();
                    res(true);
                }
            }

            generatePart();
        });
    }

    private drawGroundPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
        return new Promise((res) => {
            const loading = LoadingPage.start('Generating Map. Draw ground', height);

            const image = AssetsManager.getMapTexture('ground');
            if (!image) {
                throw new Error("[WorldMap drawGroundPattern] can't receive ground texture");
            }
            const iWidth = image.width;
            const iHeight = image.width;

            let y = 0;

            const draw = () => {
                for (let x = 0; x < width; x += iWidth) {
                    ctx.drawImage(image, x, y, iWidth, iHeight);
                }

                if (y < height) {
                    y += iHeight;
                    loading.setCurrent(y);
                    setTimeout(() => {
                        draw();
                    });
                } else {
                    loading.done();
                    res(true);
                }
            };
            draw();
        });
    }

    private drawGrass(ctx: CanvasRenderingContext2D, matrix: number[][]) {
        return new Promise((res) => {
            const image = AssetsManager.getMapTexture('grass');
            if (!image) {
                throw new Error(`[WorldMap drawGrass] can't receive grass texture`);
            }

            const size = image.width;

            const loading = LoadingPage.start('Generating Map. Draw grass', matrix.length);

            let y = 0;
            const draw = () => {
                for (let x = 0; x < matrix[y].length; x++) {
                    const current = matrix[y][x];
                    if (current) {
                        const top = matrix[y - 1][x];

                        if (top === 0) {
                            ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
                        }
                    }
                }

                if (y < matrix.length - 1) {
                    y++;
                    loading.setCurrent(y);
                    setTimeout(() => {
                        draw();
                    });
                } else {
                    loading.done();
                    res(true);
                }
            };

            draw();
        });
    }

    private clipGroundPatternByMatrix(ctx: CanvasRenderingContext2D, matrix: number[][]) {
        const stepMax = 32;
        const loading = LoadingPage.start('Generating Map. Clip matrix', stepMax);

        const partsInStep = matrix.length / stepMax;
        let step = 0;

        return new Promise((res) => {
            const clip = () => {
                for (let i = 0; i < partsInStep; i++) {
                    const y = i + partsInStep * step;
                    for (let x = 0; x < matrix[y].length; x++) {
                        if (matrix[y][x] === 0) {
                            ctx.clearRect(x, y, 1, 1);
                        }
                    }
                }

                if (step < stepMax - 1) {
                    step++;
                    loading.setCurrent(step);
                    setTimeout(() => {
                        clip();
                    });
                } else {
                    loading.done();
                    res(true);
                }
            };

            clip();
        });
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

    public getObjectPlace = (
        matrix = this.mapMatrix.matrix,
        width = 0,
        height = 0,
        attempt = 5
    ): { x: number; y: number } => {
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
            if (cell === 0) {
                prevSkipped = false;
            }

            if (cell === 1) {
                if (skipped === skips && !prevSkipped) {
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

    public getEntityPlace = (entities: Entity[], radius: number, attempt = 5): { x: number; y: number } => {
        const { matrix } = this.mapMatrix;
        const { width, height } = this.sizes;
        const { random } = this;
        const r = radius;

        const spawnZone = width / 1.5;
        const xRandom = Math.round(random.get() * spawnZone + (width - spawnZone) / 2);

        const placesY: number[] = [];

        for (let y = height - 4; y > 0; y--) {
            const prevCell = matrix[y + 1][xRandom];
            const cell = matrix[y][xRandom];
            if (cell === 1 && prevCell === 0) {
                placesY.push(y);
            }
        }
        placesY.reverse();

        const isNoWormHere = (entities: Entity[], newPos: Point2) => {
            let answer = true;
            entities.forEach((entity) => {
                if (newPos.getDistanceToPoint(entity.position) < ESizes.worm * 3.5) answer = false;
            });
            return answer;
        };

        const ceilsAroundAreEmpty = (xN: number, yN: number, r: number) => {
            const iX = Math.floor(xN);
            const iY = Math.floor(yN);
            const point = new Point2(xN, yN);
            const roundedRadius = Math.round(r);
            for (let y = iY - roundedRadius; y < iY + roundedRadius; y++) {
                for (let x = iX - roundedRadius; x < iX + roundedRadius; x++) {
                    const dist = point.getDistanceToPoint(new Point2(x, y));
                    if (dist <= roundedRadius) {
                        if (matrix[y] && matrix[y][x] === 1) {
                            return false;
                        }
                    }
                }
            }

            return true;
        };

        for (let i = 0; i < placesY.length; i++) {
            const yCord = placesY[i];
            if (ceilsAroundAreEmpty(xRandom, yCord + r + 5, r) && isNoWormHere(entities, new Point2(xRandom, yCord))) {
                return { x: xRandom, y: yCord + r + 5 };
            }
        }

        if (attempt > 0) {
            return this.getEntityPlace(entities, radius, attempt - 1);
        }
        return { x: xRandom, y: height };
    };
}
