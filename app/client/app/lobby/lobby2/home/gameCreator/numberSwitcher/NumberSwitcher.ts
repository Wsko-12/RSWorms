import Switcher from '../switcher/Switcher';
import './style.scss';

export default class NumberSwitcher extends Switcher {
    protected value: number;
    private options: {
        min: number;
        max: number;
        step: number;
    };
    constructor(title: string, min: number, max: number, step: number, value?: number) {
        super(title);
        this.value = value || min;
        this.options = { min, max, step };

        this.elements.value.innerHTML = this.value.toString();

        this.updateValue(0);
    }

    protected updateValue = (dir: 1 | -1 | 0) => {
        this.elements.left.classList.remove('switcher__button_disabled');
        this.elements.right.classList.remove('switcher__button_disabled');
        if (dir) {
            this.value += this.options.step * dir;
        }

        if (this.value <= this.options.min) {
            this.value = this.options.min;
            this.elements.left.classList.add('switcher__button_disabled');
        }

        if (this.value >= this.options.max) {
            this.value = this.options.max;
            this.elements.right.classList.add('switcher__button_disabled');
        }

        this.elements.value.innerHTML = this.value.toString();
    };

    public getValue() {
        return this.value;
    }
}
