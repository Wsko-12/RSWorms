import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import { IExplosionOptions } from '../../../../../../../ts/interfaces';
import MapMatrix from '../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../Entity';
import BBarrelExplosion from '../../worm/weapon/bullet/throwable/Fallen/BBarrelExplosion';
import FallenItem from '../FallenItem';

export default class Barrel extends FallenItem {
    protected object3D: Group;
    private bullet = new BBarrelExplosion(this);
    private isExploded = false;

    constructor(x: number, y: number) {
        super('barrel', 30, x, y);
        const geometry = new PlaneBufferGeometry(150, 150);
        const texture = FallenItem.getSprite('barrel').texture;

        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        this.object3D = new Group();
        const barrelMesh = new Mesh(geometry, material);

        this.object3D.add(barrelMesh, this.bullet.getObject3D());
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        return;
    }

    public acceptExplosion(mapMatrix: MapMatrix, entities: Entity[], options: IExplosionOptions): number {
        if (this.isExploded) {
            return 0;
        }
        this.isExploded = true;
        this.bullet.explode(mapMatrix, entities);
        setTimeout(() => {
            this.remove();
        }, 100);
        return 0;
    }
}
