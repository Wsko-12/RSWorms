import PackTextureLoader from '../PackTextureLoader';

export default class WeaponTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/weapons/';
        const path = mapTexturesFolder;
        this.textures.bazooka = await this.loadImage(path + 'bazooka.png');
        this.textures.grenade = await this.loadImage(path + 'grenade.png');
        this.textures.dynamite = await this.loadImage(path + 'dynamite.png');
        return true;
    }
}
