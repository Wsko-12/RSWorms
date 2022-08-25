import { EWeapons } from './enums';

export const isWeapon = (value: string | null): value is EWeapons => {
    if (!value) {
        return false;
    }

    return value in EWeapons;
};
