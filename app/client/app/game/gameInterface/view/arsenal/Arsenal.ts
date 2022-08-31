import './style.scss';
import { TChooseWeaponCallback } from '../../../../../../ts/types';
import { IWeapon } from '../../../../../../ts/interfaces';
import { isWeapon } from '../../../../../../ts/typeguards';

export default class Arsenal {
    private isShown = false;
    public isAvalible = false;
    public chooseWeaponCallback: TChooseWeaponCallback | null = null;
    static allWeapons: IWeapon[] = [
        { name: '1', turnsToAvaliable: 0 },
        { name: '1', turnsToAvaliable: 0 },
        { name: '1', turnsToAvaliable: 0 },
        { name: '1', turnsToAvaliable: 0 },
        { name: '1', turnsToAvaliable: 0 },
        { name: 'bazooka', turnsToAvaliable: 0 },
        { name: 'grenade', turnsToAvaliable: 0 },
        { name: 'dynamite', turnsToAvaliable: 2 },
        { name: 'mine', turnsToAvaliable: 3 },
    ];
    weapons: string[];

    constructor(weapons?: string[]) {
        this.weapons = weapons as string[];
    }

    public renderArsenal() {
        if (this.isAvalible) {
            let arsenal = document.querySelector('.arsenal') as HTMLElement;
            if (!arsenal) {
                arsenal = document.createElement('div');
                arsenal.classList.add('arsenal');
                arsenal.style.bottom = `0px`;
                document.body.append(arsenal);
                arsenal.style.right = `-${arsenal.offsetWidth}px`;
                const items = [];

                for (let i = 0; i < 78; i++) {
                    const item = document.createElement('div');
                    item.classList.add('item');
                    if (i % 6 === 0) {
                        item.id = item.innerHTML = i === 0 ? `Util` : `F${Math.trunc(i / 6)}`;
                        item.classList.add('arsenal-titles');
                    } else {
                        item.id = `w${i - Math.trunc(i / 6)}`;
                    }
                    items.push(item);
                    const itemWrapper = document.createElement('div');
                    itemWrapper.classList.add('item-wrapper');
                    itemWrapper.append(item);
                    // arsenal.append(item);
                    arsenal.append(itemWrapper);
                }

                Arsenal.allWeapons.forEach((el, index) => {
                    if (this.weapons.includes(el.name)) {
                        const item = document.getElementById(`w${index + 1}`) as HTMLElement;
                        item.style.backgroundImage = `url(../../../../assets/interface/${el.name}.png)`;
                        console.log(item);
                    }
                });

                arsenal.addEventListener('click', (e) => {
                    if (e.target != arsenal) {
                        const target = <HTMLElement>e.target;
                        if (target && target.id.slice(0, 1) === 'w') {
                            const weapon = Arsenal.allWeapons[Number(target.id.slice(1)) - 1].name;
                            if (weapon && isWeapon(weapon)) {
                                this.chooseWeaponCallback && this.chooseWeaponCallback(weapon);
                            }
                            this.hide(arsenal);
                        }
                    }
                });
            }

            if (this.isShown) {
                this.hide(arsenal);
            } else {
                this.showArs(arsenal);
            }
        }
    }

    private showArs(element: HTMLElement) {
        this.isShown = true;
        element.style.transform = `translateX(-${element.offsetWidth}px)`;
    }

    private hide(element: HTMLElement) {
        this.isShown = false;
        element.style.transform = `translateX(0px)`;
    }

    public setChooseWeaponCallback = (cb: TChooseWeaponCallback) => {
        this.chooseWeaponCallback = cb;
    };

    static deleteArsenal() {
        console.log('del');
        document.body.removeChild(document.querySelector('.arsenal') as Node);
    }
}
