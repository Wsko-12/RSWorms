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

    protected loadPngArray(
        arr: string[],
        path: string,
        loading: { setCurrent: (value: number) => void; done: () => void }
    ) {
        return new Promise((res) => {
            let index = 0;
            const loadImage = async () => {
                const name = arr[index];
                this.textures[name] = await this.loadImage(path + name + '.png');
                index++;
                if (index < arr.length) {
                    loading.setCurrent(index + 1);
                    loadImage();
                } else {
                    res(true);
                }
            };

            loadImage();
        });
    }

    abstract load(): Promise<boolean>;
}
