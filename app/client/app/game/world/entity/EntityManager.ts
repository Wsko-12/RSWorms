import { Scene } from 'three';
import { ELangs } from '../../../../../ts/enums';
import { TLoopCallback } from '../../../../../ts/types';
import Team from '../../team/Team';
import WorldMap from '../worldMap/WorldMap';
import Entity from './Entity';
import Worm from './worm/Worm';

let test = -80;

export default class EntityManager {
    private readonly mainScene: Scene;
    private worldMap: WorldMap | null = null;
    private entities: Entity[] = [];
    private teams: Team[] = [];
    private currentTeamIdx = 0;
    constructor(mainScene: Scene) {
        this.mainScene = mainScene;
    }

    public createTeams(quantity = 2, names = ['Developers', 'Computer']) {
        names.forEach((name) => this.createTeam(name));
    }

    public createTeam(name: string, lang = ELangs.rus, quantity?: number, wormNames?: string[]) {
        const team = new Team(name, lang, quantity, wormNames, this.removeEntity);
        this.teams.push(team);
        team.worms.forEach((worm) => this.entities.push(worm));
    }

    public getNextTeam() {
        if (this.currentTeamIdx >= this.teams.length) {
            this.currentTeamIdx = 0;
        }
        return this.teams[this.currentTeamIdx++];
    }

    public appendWorms() {
        this.entities.forEach((entity) => {
            if (entity instanceof Worm) {
                const place = this.findPlace();
                entity.position.x = place.x;
                entity.position.y = place.y;
                this.mainScene.add(entity.getObject3D());
                console.log(entity);
            }
        })
    }

    public setWorldMap(worldMap: WorldMap) {
        this.worldMap = worldMap;
        // this.createWorm('test');
    }

    private findPlace() {
        test += 200;
        if (this.worldMap) {
            const { width, height } = this.worldMap.getSizes();
            return { x: width / 2 - 800 + test, y: height };
        }
        return { x: 0, y: 0 };
    }

    public createWorm(id: string) {
        if (this.worldMap) {
            const place = this.findPlace();
            const worm = new Worm(this.removeEntity, id, 'vasya', place.x, place.y);
            this.entities.push(worm);
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

    public getWorm = (id: string): Worm | null => {
        const worm = this.getEntity(id);
        return worm instanceof Worm ? worm : null;
    };

    public getEntity = (id: string): Entity | null => {
        const entity = this.entities.find((entity) => entity.id === id);
        return entity || null;
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
