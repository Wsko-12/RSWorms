import { Scene } from 'three';
import { IStartGameOptions } from '../../../../ts/interfaces';
import { TLoopCallback } from '../../../../ts/types';
import Background from './background/Background';
import EntityManager from './entity/EntityManager';
import WorldMap from './worldMap/WorldMap';

export default class World {
    private mainScene = new Scene();
    private background = new Background();
    private worldMap = new WorldMap();
    private options: IStartGameOptions;
    public wind = 0;
    entityManager = new EntityManager(this.mainScene);
    constructor(options: IStartGameOptions) {
        this.options = options;
    }

    public async init() {
        this.background.init(this.options.worldSize);
        await this.worldMap.init(this.options);
        this.entityManager.setWorldMap(this.worldMap);
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

    public changeWind() {
        this.wind = (Math.random() - 0.5) * 2;
    }

    public update: TLoopCallback = (time) => {
        this.entityManager.update(time, this.wind);
    };
}
