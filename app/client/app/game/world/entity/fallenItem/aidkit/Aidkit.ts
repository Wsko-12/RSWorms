import { Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry } from 'three';
import { IExplosionOptions } from '../../../../../../../ts/interfaces';
import MapMatrix from '../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../Entity';
import FallenItem from '../FallenItem';

export default class Aidkit extends FallenItem {
    protected object3D: Group;
    private isExploded = false;
    private hpInc = 50;

    constructor(x: number, y: number) {
        super('aidkit', 20, x, y);
        const geometry = new PlaneBufferGeometry(100, 100);
        const texture = FallenItem.getSprite('aidkit').texture;

        const material = new MeshBasicMaterial({
            map: texture,
            alphaTest: 0.5,
        });

        this.object3D = new Group();
        const mesh = new Mesh(geometry, material);

        this.object3D.add(mesh);
    }

    protected handleCollision(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        return;
    }

    public acceptExplosion(mapMatrix: MapMatrix, entities: Entity[], options: IExplosionOptions): number {
        if (this.isExploded) {
            return 0;
        }
        this.isExploded = true;
        this.remove();
        return 0;
    }

    public acceptHelp() {
        this.remove();
        return this.hpInc;
    }
}
