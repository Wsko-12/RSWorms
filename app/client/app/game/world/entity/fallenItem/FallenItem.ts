import { NearestFilter, Texture } from 'three';
import AssetsManager from '../../../assetsManager/AssetsManager';
import Entity from '../Entity';

export default abstract class FallenItem extends Entity {
    private static texturesPack = ['barrel'];
    private static sprites: Record<string, { update: () => void; texture: Texture }> = {};
    public static createTextures() {
        const textures = ['barrel', 'aidkit'];
        textures.forEach((name) => {
            const image = AssetsManager.getEffectTexture(name);
            if (!image) {
                throw new Error(`[FallenItem createTextures] can't receive image ${name}`);
            }
            this.sprites[name] = this.createSprite(image);
        });
    }
    public static getSprite(name: string) {
        return this.sprites[name];
    }
    private static createSprite(image: HTMLImageElement) {
        let step = 0;
        const maxSteps = image.naturalHeight / image.naturalWidth;
        const sprite = this.createCanvasTexture(image);
        const size = image.naturalWidth;
        let animationDirection = 1;

        if (sprite.canvas.width != size) {
            sprite.canvas.width = size;
            sprite.canvas.height = size;
        }

        const update = () => {
            if (step >= maxSteps - 1) {
                animationDirection = -1;
            }
            if (step <= 0) {
                animationDirection = 1;
            }

            step += animationDirection;

            sprite.ctx.clearRect(0, 0, size, size);
            sprite.ctx.drawImage(image, 0, -step * size);
            sprite.texture.needsUpdate = true;
        };

        return {
            update,
            texture: sprite.texture,
        };
    }

    private static createCanvasTexture(image: HTMLImageElement) {
        const canvas = document.createElement('canvas');
        const size = image.naturalWidth;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error(`[FallenItem createCanvasTexture] can't receive ctx`);
        }

        const texture = new Texture(canvas);
        texture.needsUpdate = true;
        texture.magFilter = NearestFilter;

        return {
            canvas,
            ctx,
            texture,
        };
    }

    public static spriteLoop() {
        for (const key in this.sprites) {
            this.sprites[key].update();
        }
    }
}
