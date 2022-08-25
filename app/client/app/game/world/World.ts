import { Scene } from 'three';
import { IStartGameOptions } from '../../../../ts/interfaces';
import { TLoopCallback } from '../../../../ts/types';
import Background from './background/Background';
import EntityManager from './entity/EntityManager';
import Water from './water/Water';
import Wind from './wind/Wind';
import WorldMap from './worldMap/WorldMap';

export default class World {
    private mainScene = new Scene();
    private background = new Background();
    private worldMap = new WorldMap();
    private options: IStartGameOptions;
    private wind = new Wind();
    private water: Water;

    public entityManager = new EntityManager(this.mainScene);
    constructor(options: IStartGameOptions) {
        this.options = options;
        this.water = new Water(options.worldSize);
    }

    public async init() {
        this.background.init(this.options.worldSize);
        await this.worldMap.init(this.options);
        this.wind.init(this.options.worldSize);
        this.entityManager.setWorldMap(this.worldMap);
        return true;
    }

    public raiseWaterLevel() {
        this.water.raiseLevel();
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

        const windParticles = this.wind.getObject3D();
        if (windParticles) {
            this.mainScene.add(windParticles);
        }

        const water = this.water.getObject3D();
        if (water) {
            this.mainScene.add(water);
        }
    }
    public getMainScene() {
        return this.mainScene;
    }

    public changeWind() {
        this.wind.change();
        return this.wind.getCurrentValue();
    }

    public update: TLoopCallback = (time) => {
        this.wind.update(time);
        this.entityManager.update(time, this.wind.getCurrentValue());
        this.water.update(time);

    };

    public spriteLoop: TLoopCallback = (time) => {
        this.wind.update(time);
        this.entityManager.spriteLoop(time);
        this.entityManager.update(time, this.wind.getCurrentValue());
    };
}
