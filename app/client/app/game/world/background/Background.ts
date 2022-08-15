import { Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, RepeatWrapping, Texture, Vector2 } from 'three';
import { EProportions, EWorldSizes } from '../../../../../ts/enums';
import AssetsManager from '../../assetsManager/AssetsManager';

export default class Background {
    private object3D: Object3D | null = null;

    public init(worldSize: EWorldSizes) {
        const image = AssetsManager.getMapTexture('bg');
        if (image) {
            const textureWidth = image.width;

            const texture = new Texture(image);
            texture.flipY = false;

            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.repeat = new Vector2(worldSize / textureWidth, 1);

            texture.needsUpdate = true;
            const material = new MeshBasicMaterial({
                map: texture,
            });
            const geometry = new PlaneGeometry(worldSize * 2 * EProportions.mapWidthToHeight, worldSize * 2);

            const object = new Mesh(geometry, material);
            object.position.set(worldSize, worldSize / EProportions.mapWidthToHeight, -50);

            this.object3D = object;
        } else {
            throw new Error("[World Background]: Can't find texture");
        }
    }

    public getObject3D() {
        return this.object3D;
    }
}
