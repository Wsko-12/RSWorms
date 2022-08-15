import {
    BoxBufferGeometry,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    PlaneBufferGeometry,
    Scene,
    Texture,
} from 'three';
import { EProportions } from '../../../../ts/enums';
import { IStartGameOptions } from '../../../../ts/interfaces';
import AssetsManager from '../assetsManager/AssetsManager';
import Background from './background/Background';

export default class World {
    private mainScene = new Scene();
    private background = new Background();
    private options: IStartGameOptions;
    constructor(options: IStartGameOptions) {
        this.options = options;
    }

    public init() {
        this.background.init(this.options.worldSize);
    }

    public create() {
        const backgroundPlane = this.background.getObject3D();
        if (backgroundPlane) {
            this.mainScene.add(backgroundPlane);
        }

        // const mapPlane = new Mesh(
        //     new PlaneBufferGeometry(this.options.worldSize * EProportions.mapWidthToHeight, this.options.worldSize),
        //     new MeshBasicMaterial()
        // );
        // mapPlane.position.set(
        //     (this.options.worldSize * EProportions.mapWidthToHeight) / 2,
        //     this.options.worldSize / 2,
        //     0
        // );
        // this.mainScene.add(mapPlane);
    }
    public getMainScene() {
        return this.mainScene;
    }
}
