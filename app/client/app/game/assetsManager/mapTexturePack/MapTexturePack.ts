import { EMapPacksDecorItems, EMapPacksNames } from '../../../../../ts/enums';
import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
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
        const loading = LoadingPage.start('Loading Map Pack', 4 + this.decorItems);
        const prePath = process.env.NODE_ENV === 'development' ? './client' : '.';

        const mapTexturesFolder = prePath + '/assets/mapPacks/';
        const path = mapTexturesFolder + this.packName + '/';

        const textures = ['bg', 'ground', 'grass', 'particle'];
        await this.loadPngArray(textures, path, loading);

        const loadDecors = (): Promise<boolean> => {
            return new Promise((allDecorsLoaded) => {
                let index = 1;
                const load = async () => {
                    const name = 'decor' + index;
                    const texture = await this.loadImage(path + name + '.png');

                    this.textures[name] = texture;
                    index++;

                    if (index <= this.decorItems) {
                        loading.setCurrent(4 + index);
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
        loading.done();
        return true;
    }
}
