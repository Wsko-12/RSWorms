import { EWeapons } from '../../../../../ts/enums';
import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class WeaponTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/weapons/';
        const path = mapTexturesFolder;

        const textures = Object.keys(EWeapons);

        const loading = LoadingPage.start('Loading Weapons textures', textures.length);

        await this.loadPngArray(textures, path, loading);
        loading.done();
        return true;
    }
}
