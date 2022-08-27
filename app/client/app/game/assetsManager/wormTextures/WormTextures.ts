import PackTextureLoader from '../PackTextureLoader';

export default class WormTextures extends PackTextureLoader {
    public async load() {
        const mapTexturesFolder = './client/assets/worm/';
        const path = mapTexturesFolder;
        this.textures.walk = await this.loadImage(path + 'walk.png');
        this.textures.breath = await this.loadImage(path + 'breath.png');
        this.textures.backflip = await this.loadImage(path + 'backflip.png');
        this.textures.jump = await this.loadImage(path + 'jump.png');
        this.textures.fall = await this.loadImage(path + 'fall.png');
        this.textures.slide = await this.loadImage(path + 'slide.png');
        this.textures.aiming = await this.loadImage(path + 'aiming.png');
        this.textures.aim = await this.loadImage(path + 'aim.png');
        this.textures.die = await this.loadImage(path + 'die.png');
        this.textures.grave = await this.loadImage(path + 'grave.png');

        return true;
    }
}
