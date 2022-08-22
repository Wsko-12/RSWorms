export default abstract class PackTextureLoader {
    protected loaded = false;
    protected textures: Record<string, HTMLImageElement> = {};

    public isLoaded() {
        return this.loaded;
    }

    public getTexture(name: string) {
        const texture = this.textures[name];
        return texture ? texture : null;
    }

    protected loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((res) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
                res(img);
            };
        });
    }

    abstract load(): Promise<boolean>;
}
