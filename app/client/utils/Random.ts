export default class Random {
    private m = 4294967296;
    private a = 1664525;
    private c = 1013904223;
    private step = 0;

    private seed: number;
    private z: number;

    constructor(seed = Math.random()) {
        this.seed = seed;
        this.z = (this.a * this.seed + this.c) % this.m;
    }

    get() {
        this.z = (this.a * this.z + this.c) % this.m;
        return this.z / this.m;
    }

    getFromMinus() {
        const value = this.get();
        return (value - 0.5) * 2;
    }
}
