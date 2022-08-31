import { Scene } from 'three';
import { EFallenObjects, ELang, ESizes } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Aidkit from './fallenItem/aidkit/Aidkit';
import Barrel from './fallenItem/barrel/Barrel';
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
        return this.worldMap?.getWormPlace(this.entities);
    }

    public generateWorm(teamIndex: number, wormIndex: number, wormName: string, wormLang: ELang, hp: number) {
        if (this.worldMap) {
            const place = this.findPlace();
            if (!place) {
                throw new Error("[EntityManager generateWorm] can't find place");
            }
            place.y += ESizes.worm;
            const worm = new Worm(wormIndex, teamIndex, wormName, wormLang, place.x, place.y, hp);
            this.addEntity(worm);
            this.mainScene.add(worm.getObject3D());
            return worm;
        }
        return null;
    }

    public generateFallenItem() {
        if (!this.worldMap) {
            throw new Error(`[EntityManager generateFallenItem] can't find worldMap`);
        }
        const items = Object.values(EFallenObjects).filter((item) => Number.isNaN(Number(item)));
        const index = Math.floor(Math.random() * items.length);

        const constructors = [Aidkit, Barrel];
        const Item = constructors[index];

        const x = this.worldMap.getMapMatrix().matrix[0].length * Math.random();
        const y = this.worldMap.getMapMatrix().matrix.length;
        const item = new Item(x, y);
        this.addEntity(item);
        this.mainScene.add(item.getObject3D());
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
