import './style.scss';

export default class Arsenal {
    // private width: number;
    // private arsenal;
    private isShown: boolean;
    static allWeapons: string[] = ['1', '1', '1', '1', '1', 'bazooka', 'grenade', 'dynamite', 'mine'];

    constructor() {
        this.isShown = false;
    }

    public renderArs(weapons: string[]) {
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
                } else {
                    item.id = `w${i - Math.trunc(i / 6)}`;
                }
                items.push(item);
                arsenal.append(item);
            }

            Arsenal.allWeapons.forEach((el, index) => {
                if (weapons.includes(el)) {
                    const item = document.getElementById(`w${index + 1}`) as HTMLElement;
                    item.style.backgroundImage = `url(../../../../assets/weaponIcons/${el}.png)`;
                }
            });
        }
        if (this.isShown) {
            this.hide(arsenal);
        } else {
            this.showArs(arsenal);
        }
    }

    private showArs(element: HTMLElement) {
        this.isShown = true;
        element.style.transform = `translateX(-${element.offsetWidth}px)`;
        element.addEventListener('click', () => {
            this.hide(element);
        });
    }

    private hide(element: HTMLElement) {
        this.isShown = false;
        element.style.transform = `translateX(0px)`;
    }
}
