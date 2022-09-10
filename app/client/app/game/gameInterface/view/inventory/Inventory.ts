import { EWeapons } from '../../../../../../ts/enums';
import { isWeapon } from '../../../../../../ts/typeguards';
import { TChooseWeaponCallback } from '../../../../../../ts/types';
import PageBuilder from '../../../../../utils/PageBuilder';
import './style.scss';

export default class Inventory {
    private element: HTMLDivElement;
    private overlay: HTMLDivElement;
    private inventory: HTMLDivElement;
    private chooseWeaponCallback: TChooseWeaponCallback | null = null;
    constructor() {
        this.element = PageBuilder.createElement('div', {
            classes: 'inventory',
        });
        this.overlay = PageBuilder.createElement('div', {
            classes: 'inventory__overlay',
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.show(false);
            }
        });

        this.inventory = this.createInventory();

        this.inventory.addEventListener('click', (e) => {
            if (e.target != this.inventory) {
                const target = <HTMLElement>e.target;
                if (target) {
                    const weapon = target.dataset.weapon;
                    if (weapon && isWeapon(weapon)) {
                        this.chooseWeaponCallback && this.chooseWeaponCallback(weapon);
                    }
                    this.show(false);
                }
            }
        });

        this.element.append(this.overlay, this.inventory);
    }

    private createInventory() {
        const container = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'inventory__container',
        });
        const weapons = Object.values(EWeapons);

        weapons.forEach((weapon) => {
            const item = PageBuilder.createElement('div', {
                classes: ['inventory__item', `inventory__item-${weapon}`],
                dataset: {
                    weapon: weapon,
                },
            });
            container.append(item);
        });

        return container;
    }

    public setChooseWeaponCallback = (cb: TChooseWeaponCallback) => {
        this.chooseWeaponCallback = cb;
    };

    public show(flag: boolean) {
        const display = flag ? 'block' : 'none';
        this.element.style.display = display;
    }

    public getElement() {
        return this.element;
    }
}
