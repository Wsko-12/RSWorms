import { Scene } from 'three';
import { ESizes } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Worm from './worm/Worm';

let test = -80;

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
        test += 80;
        if (this.worldMap) {
            const { width, height } = this.worldMap.getSizes();
            return { x: width / 4 + test, y: height };
        }
        return { x: 0, y: 0 };
    }

    public generateWorm(teamIndex: number, wormIndex: number) {
        if (this.worldMap) {
            const place = this.findPlace();
            place.y += ESizes.worm;
            const worm = new Worm(this.removeEntity, wormIndex, teamIndex, place.x, place.y);
            this.addEntity(worm);
            this.mainScene.add(worm.getObject3D());
            return worm;
        }
        return null;
    }

    public update = (time: number, wind: number) => {
        const matrix = this.worldMap?.getMapMatrix();
        if (matrix) {
            this.entities.forEach((entity) => {
                entity.update(matrix, this.entities, wind);
            });
        }
    };

    public addEntity(entity: Entity) {
        this.entities.push(entity);
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
