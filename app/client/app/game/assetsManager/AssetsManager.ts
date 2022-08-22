import { EMapPacksNames } from '../../../../ts/enums';
import { IStartGameOptions } from '../../../../ts/interfaces';
import MapTexturePack from './mapTexturePack/MapTexturePack';
import WormTextures from './wormTextures/WormTextures';

export default class AssetsManager {
    private static mapTexturePack: MapTexturePack | null = null;
    private static wormTextures: WormTextures | null = null;

    private static isMapTexturePackReady(packName: EMapPacksNames) {
        return this.mapTexturePack && this.mapTexturePack.getPackName() === packName && this.mapTexturePack.isLoaded();
    }

    static async init(options: IStartGameOptions) {
        return new Promise((res) => {
            if (this.isMapTexturePackReady(options.mapTexturePackName)) {
                res(true);
            } else {
                this.mapTexturePack = new MapTexturePack(options.mapTexturePackName);
                this.mapTexturePack.load().then(() => {
                    this.wormTextures = new WormTextures();
                    this.wormTextures.load().then(() => {
                        res(true);
                    });
                });
            }
        });
    }

    static getMapTexture(name: string) {
        return this.mapTexturePack?.getTexture(name);
    }

    static getWormTexture(name: string) {
        return this.wormTextures?.getTexture(name);
    }
}
