import { EBullets, ESoundsBullet, EWeapons } from '../../../../../../../../../../../ts/enums';
import { IBulletOptions } from '../../../../../../../../../../../ts/interfaces';
import MapMatrix from '../../../../../../../worldMap/mapMatrix/MapMatrix';
import Entity from '../../../../../../Entity';
import FlightBullet from '../Flight';
import BBananasChild from './BBananaGrenadeChild';

export default class BBananaGrenade extends FlightBullet {
    options: IBulletOptions;
    child = BBananasChild;
    childQuantity = 5;
    hasChilds = true;
    collisionSound = ESoundsBullet.banana;
    public type: EBullets;
    constructor(options: IBulletOptions) {
        super(options, EWeapons.banana);
        this.options = options;
        this.type = EBullets.BBananaGrenade;
        this.setExplosionOptions(200, 350, 40);
        this.physics.friction = 0.65;
    }

    public explode(mapMatrix: MapMatrix, entities: Entity[], waterLevel: number): void {
        super.explode(mapMatrix, entities, waterLevel);
    }

    public createChilds() {
        const bananas = new Array(this.childQuantity).fill(1).map((el, index) => {
            const newPosition = Object.assign({}, this.position);
            const newOptions: IBulletOptions = {
                angle: index * (180 / 4),
                power: 20,
                position: newPosition,
                parentRadius: this.explosion.radius * 0.75,
            };
            newOptions.position.y += 20;
            newOptions.position.x -= this.radius * 2.5 * 1.5 - this.radius * 1.5 * index;
            return new BBananasChild(newOptions);
        });
        return bananas;
    }
}
