import { EWeapons } from '../../../../../../../../../ts/enums';
import Weapon from '../Weapon';

export default abstract class StaticWeapon extends Weapon {
    protected aimOptions = {
        hideAim: true,
        hidePower: true,
    };
    constructor(textureName: EWeapons) {
        super(textureName);
    }
}
