import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class EffectTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/effects/';
        const path = mapTexturesFolder;

        const textures = ['explosion'];
        const loading = LoadingPage.start('Loading Effects textures', textures.length);
        await this.loadPngArray(textures, path, loading);
        loading.done();

        return true;
    }
}
