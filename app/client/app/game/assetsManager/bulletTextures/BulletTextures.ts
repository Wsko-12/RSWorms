import PackTextureLoader from '../PackTextureLoader';

export default class BulletTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/bullets/';
        const path = mapTexturesFolder;
        this.textures.bazooka = await this.loadImage(path + 'bazooka.png');
        this.textures.grenade = await this.loadImage(path + 'grenade.png');
        return true;
    }
}
