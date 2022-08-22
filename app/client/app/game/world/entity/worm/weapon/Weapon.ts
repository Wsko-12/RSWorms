import {
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    Object3D,
    PlaneBufferGeometry,
    RepeatWrapping,
    Texture,
    Vector3,
} from 'three';
import { ESizes, ELayersZ } from '../../../../../../../ts/enums';
import { IShootOptions } from '../../../../../../../ts/interfaces';
import { TRemoveEntityCallback } from '../../../../../../../ts/types';
import AssetsManager from '../../../../assetsManager/AssetsManager';
import Bullet from './bullet/Bullet';

export default abstract class Weapon {
    public aimRadius = 100;
    protected bulletType = Bullet;
    private object3D: Mesh;
    private texture: Texture;
    private needShows = true;
    private shows = true;
    private currentScale = 0;

    constructor(textureName: string) {
        const geometry = new PlaneBufferGeometry(ESizes.worm * 5, ESizes.worm * 5);
        const image = AssetsManager.getWeaponTexture(textureName);
        if (!image) {
            throw new Error(`[Weapon] can't load texture: ${textureName}`);
        }
        const texture = new Texture(image);
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        texture.wrapS = RepeatWrapping;

        this.texture = texture;
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        this.object3D = new Mesh(geometry, material);
        this.object3D.position.z = ELayersZ.weapons;
        this.object3D.scale.x = this.currentScale;
        this.object3D.scale.y = this.currentScale;
    }

    public shoot(options: IShootOptions, removeEntityCallback: TRemoveEntityCallback) {
        const bullet = new this.bulletType(removeEntityCallback, Math.random().toString(), options);
        return bullet;
    }

    public getObject3D() {
        return this.object3D;
    }

    public update(angle: number, direction: number) {
        this.texture.repeat.x = -direction;

        let rad = angle * (Math.PI / 180);
        if (direction < 0) {
            rad = rad - Math.PI;
        }
        this.object3D.rotation.z = rad;

        if (!this.needShows && this.currentScale > 0) {
            this.currentScale -= 0.25;
            if (this.currentScale < 0) {
                this.currentScale = 0;
            }
        }

        if (this.needShows && this.currentScale < 1) {
            this.currentScale += 0.25;
            if (this.currentScale > 1) {
                this.currentScale = 1;
            }
        }

        this.object3D.scale.x = this.currentScale;
        this.object3D.scale.y = this.currentScale;
    }

    public show(flag: boolean, important?: number) {
        this.needShows = flag;
        if (important != undefined) {
            this.currentScale = important;
        }
    }
}
