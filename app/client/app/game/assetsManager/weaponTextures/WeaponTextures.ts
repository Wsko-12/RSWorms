import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class WeaponTextures extends PackTextureLoader {
    public async load() {
        const prePath = process.env.NODE_ENV === 'development' ? './client' : '.';
        const mapTexturesFolder = prePath + '/assets/weapons/';
        const path = mapTexturesFolder;

        const textures = ['bazooka', 'grenade', 'dynamite', 'mine'];

        const loading = LoadingPage.start('Loading Weapons textures', textures.length);

        await this.loadPngArray(textures, path, loading);
        loading.done();
        return true;
    }
}
