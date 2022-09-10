import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class EffectTextures extends PackTextureLoader {
    public async load() {
        const prePath = process.env.NODE_ENV === 'development' ? './client' : '.';

        const mapTexturesFolder = prePath + '/assets/effects/';
        const path = mapTexturesFolder;

        const textures = ['explosion', 'barrel', 'aidkit'];
        const loading = LoadingPage.start('Loading Effects textures', textures.length);
        await this.loadPngArray(textures, path, loading);
        loading.done();

        return true;
    }
}
