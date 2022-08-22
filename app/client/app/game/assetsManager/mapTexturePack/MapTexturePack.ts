import { EMapPacksDecorItems, EMapPacksNames } from '../../../../../ts/enums';
import PackTextureLoader from '../PackTextureLoader';

export default class MapTexturePack extends PackTextureLoader {
    private packName: EMapPacksNames;
    public decorItems: number;
    constructor(packName: EMapPacksNames) {
        super();
        this.packName = packName;
        this.decorItems = EMapPacksDecorItems[packName];
    }

    public getPackName() {
        return this.packName;
    }

    public async load() {
        const mapTexturesFolder = './client/assets/mapPacks/';
        const path = mapTexturesFolder + this.packName + '/';
        this.textures.bg = await this.loadImage(path + 'bg.png');
        this.textures.ground = await this.loadImage(path + 'ground.png');
        this.textures.grass = await this.loadImage(path + 'grass.png');
        this.textures.particle = await this.loadImage(path + 'particle.png');

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
