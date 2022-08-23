import PackTextureLoader from '../PackTextureLoader';

export default class EffectTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/effects/';
        const path = mapTexturesFolder;
        this.textures.explosion = await this.loadImage(path + 'explosion.png');

        return true;
    }
}
