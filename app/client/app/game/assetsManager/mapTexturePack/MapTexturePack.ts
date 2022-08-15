import { EMapPacksDecorItems, EMapPacksNames } from '../../../../../ts/enums';

export default class MapTexturePack {
    private packName: EMapPacksNames;
    private textures: Record<string, HTMLImageElement> = {};

    private loaded = false;
    public decorItems: number;
    constructor(packName: EMapPacksNames) {
        this.packName = packName;
        this.decorItems = EMapPacksDecorItems[packName];
    }

    public isLoaded() {
        return this.loaded;
    }

    public getPackName() {
        return this.packName;
    }

    public getTexture(name: string) {
        const texture = this.textures[name];
        return texture ? texture : null;
    }

    private loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((res) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
                res(img);
            };
        });
    }

    public async load() {
        const mapTexturesFolder = './client/assets/mapPacks/';
        const path = mapTexturesFolder + this.packName + '/';
        this.textures.bg = await this.loadImage(path + 'bg.png');
        this.textures.ground = await this.loadImage(path + 'ground.png');
        this.textures.grass = await this.loadImage(path + 'grass.png');

        const loadDecors = (): Promise<boolean> => {
            return new Promise((allDecorsLoaded) => {
                let index = 1;
                const load = async () => {
                    const name = 'decor' + index;
                    const texture = await this.loadImage(path + name + '.png');

                    this.textures[name] = texture;
                    index++;

                    if (index <= this.decorItems) {
                        load();
                    } else {
                        this.loaded = true;
                        allDecorsLoaded(true);
                    }
                };
                load();
            });
        };

        await loadDecors();
        return true;
    }
}
