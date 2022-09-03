import {
    Group,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    Object3D,
    PlaneBufferGeometry,
    RepeatWrapping,
    Texture,
} from 'three';
import { ELayersZ, ESoundsWeapon, ESoundsWormSpeech, EWeapons } from '../../../../../../../../ts/enums';
import { IBulletOptions, IShootOptions } from '../../../../../../../../ts/interfaces';
import SoundManager from '../../../../../../soundManager/SoundManager';
import AssetsManager from '../../../../../assetsManager/AssetsManager';
import Bullet from '../bullet/Bullet';
import Aim from './aim/Aim';

export default abstract class Weapon {
    public abstract name: EWeapons;
    protected abstract shootSound: ESoundsWeapon | ESoundsWormSpeech;
    protected bullet = Bullet;
    protected object3D: Object3D;
    protected aim = new Aim();
    private weaponMesh: Mesh;
    private texture: Texture;

    protected aimOptions = {
        hideAim: false,
        hidePower: false,
    };

    private showOptions = {
        needShows: true,
        shows: true,
        currentScale: 0,
    };

    constructor(textureName: EWeapons) {
        this.object3D = new Group();

        const image = AssetsManager.getWeaponTexture(textureName);
        if (!image) {
            throw new Error(`[Weapon] can't load weapon sprite ${textureName}`);
        }
        const texture = new Texture(image);
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        texture.wrapS = RepeatWrapping;
        this.texture = texture;

        const geometry = new PlaneBufferGeometry(100, 100);
        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });
        this.weaponMesh = new Mesh(geometry, material);
        this.weaponMesh.position.z = ELayersZ.weapons;

        const aimMesh = this.aim.getObject3D();
        this.object3D.add(this.weaponMesh, aimMesh);
        this.aim.hide(this.aimOptions.hidePower, this.aimOptions.hideAim);
    }

    public getObject3D() {
        return this.object3D;
    }

    public changeAim(direction: 1 | -1 | 0, speed: number, power: boolean) {
        const aim = this.aim;
        aim.changeAngle(direction, speed);
        if (power) {
            aim.changePower();
        }
    }

    public update(wormDirection: 1 | -1) {
        this.updateShowView();
        this.aim.update(wormDirection);
        this.rotateMesh(wormDirection);
    }

    public getRawAngle() {
        return this.aim.getRawAngle();
    }
    private rotateMesh(wormDirection: 1 | -1) {
        this.texture.repeat.x = -wormDirection;

        let rad = this.aim.getAngle(wormDirection) * (Math.PI / 180);
        if (wormDirection < 0) {
            rad = rad - Math.PI;
        }
        this.weaponMesh.rotation.z = rad;
    }

    private updateShowView() {
        const { showOptions } = this;
        if (!showOptions.needShows && showOptions.currentScale > 0) {
            showOptions.currentScale -= 0.1;
            if (showOptions.currentScale < 0) {
                showOptions.currentScale = 0;
            }
        }

        if (showOptions.needShows && showOptions.currentScale < 1) {
            showOptions.currentScale += 0.1;
            if (showOptions.currentScale > 1) {
                showOptions.currentScale = 1;
            }
        }

        this.object3D.scale.x = showOptions.currentScale;
        this.object3D.scale.y = showOptions.currentScale;
    }

    public show(flag: boolean, important?: number) {
        this.showOptions.needShows = flag;
        if (important != undefined) {
            this.showOptions.currentScale = important;
        }
    }

    public shoot(options: IShootOptions) {
        const { angle, power } = this.aim.getShootDirection(options.wormDirection);
        const bulletOptions: IBulletOptions = {
            angle,
            power,
            position: options.position,
            parentRadius: options.parentRadius,
        };
        const bullet = new this.bullet(bulletOptions, this.name);
        this.playShoot();
        return bullet;
    }

    protected playShoot() {
        SoundManager.playWeapon(this.shootSound);
    }
}
