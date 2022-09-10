import { Scene } from 'three';
import { EBullets, EFallenObjects, ELang, ESizes } from '../../../../../ts/enums';
import { IFallenItemConstructor } from '../../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ISocketBulletData,
    ISocketEntityData,
    ISocketEntityDataPack,
    ISocketFallObjectData,
} from '../../../../../ts/socketInterfaces';
import { TLoopCallback } from '../../../../../ts/types';
import { generateId } from '../../../../utils/names';
import ClientSocket from '../../../clientSocket/ClientSocket';
import User from '../../../User';
import MultiplayerGameplayManager from '../../gameplayManager/MultiplayerGameplayManager';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Aidkit from './fallenItem/aidkit/Aidkit';
import Barrel from './fallenItem/barrel/Barrel';
import Bullet from './worm/weapon/bullet/Bullet';
import Worm from './worm/Worm';

const fallenItemsConstructors: Record<EFallenObjects, IFallenItemConstructor> = {
    Aidkit: Aidkit,
};

export default class EntityManager {
    private readonly mainScene: Scene;
    private worldMap: WorldMap | null = null;
    private entities: Entity[] = [];
    private entitiesMap: Map<string, Entity> = new Map();
    constructor(mainScene: Scene) {
        this.mainScene = mainScene;
    }

    public setWorldMap(worldMap: WorldMap) {
        this.worldMap = worldMap;
    }

    private findPlace() {
        return this.worldMap?.getEntityPlace(this.entities, ESizes.worm);
    }

    public generateWorm(
        teamIndex: number,
        teamName: string,
        wormIndex: number,
        wormName: string,
        wormLang: ELang,
        hp: number
    ) {
        if (this.worldMap) {
            const place = this.findPlace();
            if (!place) {
                throw new Error("[EntityManager generateWorm] can't find place");
            }
            place.y += ESizes.worm;
            const worm = new Worm(wormIndex, teamIndex, teamName, wormName, wormLang, place.x, place.y, hp);
            this.addEntity(worm);
            this.mainScene.add(worm.getObject3D());
            return worm;
        }
        return null;
    }

    public generateFallenItem(data?: ISocketFallObjectData) {
        if (!this.worldMap) {
            throw new Error(`[EntityManager generateFallenItem] can't find worldMap`);
        }
        let item;
        const y = this.worldMap.getMapMatrix().matrix.length;
        if (data) {
            const Item = fallenItemsConstructors[data.name];
            item = new Item(data.x, y);
            item.id = data.id;
        } else {
            const constructors = Object.values(fallenItemsConstructors);
            const index = Math.floor(Math.random() * constructors.length);

            const Item = constructors[index];

            const x = this.worldMap.getMapMatrix().matrix[0].length * Math.random();
            item = new Item(x, y);
        }

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

    public soundLoop = () => {
        this.entities.forEach((entity) => entity.soundLoop());
    };

    public addEntity(entity: Entity) {
        entity.setRemoveFromEntityCallback(this.removeEntity);
        this.entitiesMap.set(entity.id, entity);
        this.entities.push(entity);

        if (MultiplayerGameplayManager.isOnline && User.inGame) {
            if (MultiplayerGameplayManager.getCurrentTurnPlayerName() === User.nickname) {
                if (entity instanceof Bullet) {
                    const id = `Bullet_${generateId()}`;
                    entity.id = id;
                    const type = entity.type;
                    const data = entity.getSocketData(false);

                    const socketData: ISocketBulletData = {
                        game: User.inGame,
                        data,
                        type,
                        options: entity.getStartBulletOptions(),
                    };

                    ClientSocket.emit<ISocketBulletData>(ESocketGameMessages.bulletCreatingClient, socketData);
                }
            }
        }
    }

    public getEntities() {
        return this.entities;
    }

    public sendLastData() {
        if (User.inGame) {
            const data: ISocketEntityDataPack = {
                game: User.inGame,
                entities: this.entities.map((entity) => entity.getSocketData(true)),
            };

            ClientSocket.emit(ESocketGameMessages.entityDataClient, data);
        }
    }

    public removeEntity = (entity: Entity) => {
        const object3D = entity.getObject3D();
        this.mainScene.remove(object3D);
        this.entitiesMap.delete(entity.id);

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

    public socketLoop = () => {
        if (MultiplayerGameplayManager.getCurrentTurnPlayerName() === User.nickname && User.inGame) {
            const data: ISocketEntityDataPack = {
                game: User.inGame,
                entities: this.entities.map((entity) => entity.getSocketData(false)),
            };

            ClientSocket.emit(ESocketGameMessages.entityDataClient, data);
        }
    };

    public setSocketData(data: ISocketEntityData[]) {
        if (User.nickname === MultiplayerGameplayManager.getCurrentTurnPlayerName()) {
            return;
        }
        data.forEach((data) => {
            const entity = this.entitiesMap.get(data.id);
            if (entity) {
                entity.setSocketData(data);
            }
        });
    }
}
