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
import { EProportions, EWorldSizes } from '../../../../../ts/enums';
import AssetsManager from '../../assetsManager/AssetsManager';

export default class Background {
    private object3D: Object3D | null = null;

    public init(worldSize: EWorldSizes) {
        const image = AssetsManager.getMapTexture('bg');
        if (image) {
            const textureWidth = image.width;

            const width = worldSize * EProportions.mapWidthToHeight * 2;
            const height = worldSize * 2;
            const texture = new Texture(image);

            // to disable pixels and create more smooth disable next line
            texture.magFilter = NearestFilter;

            texture.flipY = false;

            texture.wrapS = RepeatWrapping;
            texture.repeat = new Vector2(width / (worldSize / EWorldSizes.small) / textureWidth, 1);
            texture.needsUpdate = true;
            const material = new MeshBasicMaterial({
                map: texture,
            });
            const geometry = new PlaneGeometry(width, height);

            const object = new Mesh(geometry, material);
            object.position.set(width / 4, height / 4, -100);

            this.object3D = object;
        } else {
            throw new Error("[World Background]: Can't find texture");
        }
    }

    public getObject3D() {
        return this.object3D;
    }
}
