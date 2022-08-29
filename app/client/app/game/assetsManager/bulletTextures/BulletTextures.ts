import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class BulletTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/bullets/';
        const path = mapTexturesFolder;

        const textures = ['bazooka', 'grenade', 'dynamite', 'mine'];

        const loading = LoadingPage.start('Loading Bullets textures', textures.length);

        await this.loadPngArray(textures, path, loading);
        loading.done();

        return true;
    }
}
