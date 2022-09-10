import LoadingPage from '../../../../utils/LoadingPage/LoadingPage';
import PackTextureLoader from '../PackTextureLoader';

export default class WormTextures extends PackTextureLoader {
    public async load() {
        const prePath = process.env.NODE_ENV === 'development' ? './client' : '.';
        const mapTexturesFolder = prePath + '/assets/worm/';
        const path = mapTexturesFolder;

        const textures = [
            'walk',
            'breath',
            'backflip',
            'jump',
            'fall',
            'slide',
            'aiming',
            'aim',
            'die',
            'grave',
            'celebrate',
            'drown',
        ];

        const loading = LoadingPage.start('Loading Worm textures', textures.length);

        await this.loadPngArray(textures, path, loading);
        loading.done();

        return true;
    }
}
