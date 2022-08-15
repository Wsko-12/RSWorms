import { Scene } from 'three';
import { IStartGameOptions } from '../../../../ts/interfaces';
import Background from './background/Background';
import WorldMap from './worldMap/WorldMap';

export default class World {
    private mainScene = new Scene();
    private background = new Background();
    private worldMap = new WorldMap();
    private options: IStartGameOptions;
    constructor(options: IStartGameOptions) {
        this.options = options;
    }

    public async init() {
        this.background.init(this.options.worldSize);
        await this.worldMap.init(this.options);
        return true;
    }

    public create() {
        const backgroundPlane = this.background.getObject3D();
        if (backgroundPlane) {
            this.mainScene.add(backgroundPlane);
        }

        const mapPlane = this.worldMap.getObject3D();
        if (mapPlane) {
            this.mainScene.add(mapPlane);
        }
    }
    public getMainScene() {
        return this.mainScene;
    }
}
