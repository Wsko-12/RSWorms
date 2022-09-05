import { EMapPacksNames, EWeapons, EWorldSizes } from './enums';

export const isWeapon = (value: string | null): value is EWeapons => {
    if (!value) {
        return false;
    }

    return value in EWeapons;
};

export const isWorldSizesKey = (value: string | null): value is keyof typeof EWorldSizes => {
    if (!value) {
        return false;
    }

    return Object.keys(EWorldSizes).includes(value);
};

export const isMapTexturePack = (value: string | null): value is keyof typeof EMapPacksNames => {
    if (!value) {
        return false;
    }

    return Object.keys(EMapPacksNames).includes(value);
};
