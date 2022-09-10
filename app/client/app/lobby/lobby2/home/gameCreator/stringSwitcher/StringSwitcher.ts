import Switcher from '../switcher/Switcher';
import './style.scss';

export default class StringSwitcher extends Switcher {
    protected value: string;
    private options: {
        values: string[];
        index: number;
    };

    constructor(title: string, values: string[], index?: number) {
        super(title);
        this.value = values[0];

        this.options = {
            values: [...values],
            index: index || 0,
        };

        this.elements.value.classList.add('switcher_string__value');
        this.updateValue(0);
    }

    protected updateValue = (dir: 1 | -1 | 0) => {
        this.elements.left.classList.remove('switcher__button_disabled');
        this.elements.right.classList.remove('switcher__button_disabled');
        if (dir) {
            this.options.index += dir;
        }

        if (this.options.index <= 0) {
            this.options.index = 0;
            this.elements.left.classList.add('switcher__button_disabled');
        }

        if (this.options.index >= this.options.values.length - 1) {
            this.options.index = this.options.values.length - 1;
            this.elements.right.classList.add('switcher__button_disabled');
        }

        const { index, values } = this.options;
        this.value = values[index];

        this.elements.value.innerHTML = this.value;
    };

    public getValue() {
        return this.value;
    }
}
