import {
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    Object3D,
    PlaneGeometry,
    RepeatWrapping,
    Texture,
    Vector2,
} from 'three';
import { EConstants, ELayersZ, EProportions, EWorldSizes } from '../../../../../ts/enums';
import AssetsManager from '../../assetsManager/AssetsManager';

export default class Background {
    private object3D: Object3D | null = null;

    public init(worldSize: EWorldSizes) {
        const image = AssetsManager.getMapTexture('bg');
        if (image) {
            const textureWidth = image.width;
            const textureHeight = image.height;
            const textureAspect = textureHeight / textureWidth;

            const worldWidth = worldSize * EProportions.mapWidthToHeight;
            const worldHeight = worldSize;

            const width = worldSize * EProportions.mapWidthToHeight * EConstants.bgScale;
            const height = worldSize * EConstants.bgScale;
            const texture = new Texture(image);

            // to disable pixels and create more smooth disable next line
            texture.magFilter = NearestFilter;

            texture.flipY = false;

            texture.wrapS = RepeatWrapping;
            texture.repeat = new Vector2(textureAspect * EProportions.mapWidthToHeight, 1);
            texture.needsUpdate = true;
            const material = new MeshBasicMaterial({
                map: texture,
            });
            const geometry = new PlaneGeometry(width, height);

            const object = new Mesh(geometry, material);
            object.position.set(worldWidth / 2, worldHeight / 2, -ELayersZ.bg);

            this.object3D = object;
        } else {
            throw new Error("[World Background]: Can't find texture");
        }
    }

    public getObject3D() {
        return this.object3D;
    }
}
