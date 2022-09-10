import { EMapPacksNames } from '../../../../ts/enums';
import { IStartGameOptions } from '../../../../ts/interfaces';
import BulletTextures from './bulletTextures/BulletTextures';
import EffectTextures from './effectTextures/EffectTextures';
import MapTexturePack from './mapTexturePack/MapTexturePack';
import WeaponTextures from './weaponTextures/WeaponTextures';
import WormTextures from './wormTextures/WormTextures';

export default class AssetsManager {
    private static mapTexturePack: MapTexturePack | null = null;
    private static wormTextures: WormTextures | null = null;
    private static weaponTextures: WeaponTextures | null = null;
    private static bulletTextures: BulletTextures | null = null;
    private static effectTextures: EffectTextures | null = null;

    private static isMapTexturePackReady(packName: EMapPacksNames) {
        return this.mapTexturePack && this.mapTexturePack.getPackName() === packName && this.mapTexturePack.isLoaded();
    }

    static async init(options: IStartGameOptions) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res) => {
            if (this.isMapTexturePackReady(options.texture)) {
                res(true);
            } else {
                this.mapTexturePack = new MapTexturePack(options.texture);
                await this.mapTexturePack.load();
            }

            this.wormTextures = new WormTextures();
            await this.wormTextures.load();

            this.weaponTextures = new WeaponTextures();
            await this.weaponTextures.load();

            this.bulletTextures = new BulletTextures();
            await this.bulletTextures.load();

            this.effectTextures = new EffectTextures();
            await this.effectTextures.load();

            res(true);
        });
    }

    static getMapTexture(name: string) {
        return this.mapTexturePack?.getTexture(name);
    }

    static getWormTexture(name: string) {
        return this.wormTextures?.getTexture(name);
    }

    static getWeaponTexture(name: string) {
        return this.weaponTextures?.getTexture(name);
    }

    static getBulletTexture(name: string) {
        return this.bulletTextures?.getTexture(name);
    }

    static getEffectTexture(name: string) {
        return this.effectTextures?.getTexture(name);
    }
}
