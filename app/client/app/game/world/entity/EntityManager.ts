import { Scene } from 'three';
import { ESizes } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Worm from './worm/Worm';

const test = -80;

export default class EntityManager {
    private readonly mainScene: Scene;
    private worldMap: WorldMap | null = null;
    private entities: Entity[] = [];
    constructor(mainScene: Scene) {
        this.mainScene = mainScene;
    }

    public setWorldMap(worldMap: WorldMap) {
        this.worldMap = worldMap;
    }

    private findPlace() {
        return this.worldMap?.getWormPlace();
    }

    public generateWorm(teamIndex: number, wormIndex: number, wormName: string) {
        if (this.worldMap) {
            const place = this.findPlace();
            if (!place) {
                throw new Error("[EntityManager generateWorm] can't find place");
            }
            place.y += ESizes.worm;
            const worm = new Worm(wormIndex, teamIndex, wormName, place.x, place.y);
            this.addEntity(worm);
            this.mainScene.add(worm.getObject3D());
            return worm;
        }
        return null;
    }

    public update = (time: number, wind: number, waterLevel: number) => {
        const matrix = this.worldMap?.getMapMatrix();
        if (matrix) {
            this.entities.forEach((entity) => {
                entity.update(matrix, this.entities, wind, waterLevel);
            });
        }
    };

    public addEntity(entity: Entity) {
        entity.setRemoveFromEntityCallback(this.removeEntity);
        this.entities.push(entity);
    }

    public getEntities() {
        return this.entities;
    }

    public removeEntity = (entity: Entity) => {
        const object3D = entity.getObject3D();
        this.mainScene.remove(object3D);
        const index = this.entities.indexOf(entity);
        if (index != -1) {
            this.entities.splice(index, 1);
        }
    };

    public spriteLoop: TLoopCallback = (time) => {
        this.entities.forEach((entity) => {
            entity.spriteLoop(time);
        });
    };
}
