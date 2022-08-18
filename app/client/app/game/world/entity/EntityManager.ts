import { Scene } from 'three';
import { TLoopCallback } from '../../../../../ts/types';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Worm from './Worm';

export default class EntityManager {
    private readonly mainScene: Scene;
    private worldMap: WorldMap | null = null;
    private entities: Entity[] = [];
    currentWorm: Worm;
    constructor(mainScene: Scene) {
        this.mainScene = mainScene;
        this.currentWorm = new Worm(this.mainScene, 0, 0);
    }

    public setWorldMap(worldMap: WorldMap) {
        this.worldMap = worldMap;
        this.createWorm();
    }

    private findPlace() {
        if (this.worldMap) {
            const { width, height } = this.worldMap.getSizes();
            return { x: width / 2, y: height };
        }
        return { x: 0, y: 0 };
    }

    public createWorm() {
        if (this.worldMap) {
            const place = this.findPlace();
            this.currentWorm = new Worm(this.mainScene, place.x, place.y);
            this.entities.push(this.currentWorm);
            this.mainScene.add(this.currentWorm.getObject3D());
        }
    }

    public update: TLoopCallback = () => {
        const matrix = this.worldMap?.getMapMatrix();
        if (matrix) {
            this.entities.forEach((entity) => {
                entity.update(matrix);
            });
        }
    };
}
