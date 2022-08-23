import PackTextureLoader from '../PackTextureLoader';

export default class BulletTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/bullets/';
        const path = mapTexturesFolder;
        this.textures.bazooka = await this.loadImage(path + 'bazooka.png');
        this.textures.grenade = await this.loadImage(path + 'grenade.png');
        this.textures.dynamite = await this.loadImage(path + 'dynamite.png');
        this.textures.mine = await this.loadImage(path + 'mine.png');
        return true;
    }
}
