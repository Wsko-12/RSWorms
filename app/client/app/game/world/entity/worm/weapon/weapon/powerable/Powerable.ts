import { EWeapons } from '../../../../../../../../../ts/enums';
import Weapon from '../Weapon';

export default abstract class PowerableWeapon extends Weapon {
    protected aimOptions = {
        hideAim: false,
        hidePower: false,
    };
    constructor(textureName: EWeapons) {
        super(textureName);
    }
}
