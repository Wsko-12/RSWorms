import { Scene } from 'three';
import { TLoopCallback } from '../../../../../ts/types';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Worm from './Worm';

export default class EntityManager {
    private readonly mainScene: Scene;
    private worldMap: WorldMap | null = null;
    public selectedWorm: Worm | null = null;
    private entities: Entity[] = [];
    constructor(mainScene: Scene) {
        this.mainScene = mainScene;
    }

    public setWorldMap(worldMap: WorldMap) {
        this.worldMap = worldMap;
        const worm = this.createWorm();
        this.selectedWorm = worm;
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
            const worm = new Worm(this.mainScene, place.x, place.y);
            this.entities.push(worm);
            this.mainScene.add(worm.getObject3D());
            return worm;
        }
        return null;
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
