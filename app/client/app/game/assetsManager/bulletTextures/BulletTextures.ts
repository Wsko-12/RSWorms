import { EWeapons } from '../../../../../ts/enums';
import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class BulletTextures extends PackTextureLoader {
    public async load() {
        const prePath = process.env.NODE_ENV === 'development' ? './client' : '.';
        const mapTexturesFolder = prePath + '/assets/bullets/';
        const path = mapTexturesFolder;

        const textures = Object.keys(EWeapons);

        const loading = LoadingPage.start('Loading Bullets textures', textures.length);

        await this.loadPngArray(textures, path, loading);
        loading.done();

        return true;
    }
}
