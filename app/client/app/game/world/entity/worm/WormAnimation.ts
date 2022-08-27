import { NearestFilter, RepeatWrapping, Texture } from 'three';
import { IWormMoveStates } from '../../../../../../ts/interfaces';
import AssetsManager from '../../../assetsManager/AssetsManager';

export default class WormAnimation {
    private canvas = document.createElement('canvas');
    private ctx = this.canvas.getContext('2d');
    private texture = new Texture(this.canvas);

    private maxSteps = 0;
    private currentStep = 0;
    private animationDirection = 1;
    private lastAnimation = '';

    public dead = {
        plays: false,
        step: -1,
        isReady: false,
    };

    constructor() {
        this.texture.wrapS = RepeatWrapping;
        this.texture.magFilter = NearestFilter;
    }

    getCanvas() {
        return this.canvas;
    }

    public playDeadAnimation() {
        this.dead.plays = true;
    }

    private deadAnimation() {
        const image = AssetsManager.getWormTexture('die');
        if (!image) {
            throw new Error("[WormAnimation deadAnimation] can't load die texture");
        }
        const maxSteps = image.naturalHeight / image.naturalWidth;
        const size = image.naturalWidth;

        this.dead.step++;
        if (this.dead.step > maxSteps) {
            this.dead.isReady = true;
        } else {
            this.ctx?.clearRect(0, 0, size, size);
            this.ctx?.drawImage(image, 0, -this.dead.step * size);
        }
    }

    public spriteLoop = (wormStates: IWormMoveStates, wormDirection: number, aim?: number) => {
        this.texture.needsUpdate = true;
        if (this.dead.plays) {
            this.deadAnimation();
            if (!this.dead.isReady) {
                return;
            }
        }

        let image = AssetsManager.getWormTexture('breath');
        if (
            !wormStates.isMove &&
            !wormStates.isJump &&
            !wormStates.isFall &&
            !wormStates.isSlide &&
            !wormStates.isCelebrated
        ) {
            this.lastAnimation = 'breath';
            if (aim !== undefined) {
                this.lastAnimation = 'aim';
                const angle = aim + 45;
                image = AssetsManager.getWormTexture('aiming');
                if (image) {
                    const steps = image?.naturalHeight / image?.naturalWidth;
                    const step = Math.floor((angle / 135) * steps);
                    this.currentStep = step;
                }
            }
        }

        if (wormStates.isMove) {
            if (this.lastAnimation != 'move') {
                this.currentStep = 0;
            }
            this.lastAnimation = 'move';
            image = AssetsManager.getWormTexture('walk');
        }

        if (wormStates.isJump) {
            if (this.lastAnimation != 'jump') {
                this.currentStep = 0;
            }
            this.lastAnimation = 'jump';

            image = AssetsManager.getWormTexture('jump');
            if (wormStates.isDoubleJump) {
                image = AssetsManager.getWormTexture('backflip');
            }
        }

        if (wormStates.isFall) {
            if (this.lastAnimation != 'fall') {
                this.currentStep = 0;
            }
            this.lastAnimation = 'fall';
            image = AssetsManager.getWormTexture('fall');
        }

        if (wormStates.isSlide) {
            if (this.lastAnimation != 'slide') {
                this.currentStep = 0;
            }
            this.lastAnimation = 'slide';
            image = AssetsManager.getWormTexture('slide');
        }

        if (wormStates.isCelebrated) {
            if (this.lastAnimation != 'celebrate') {
                this.currentStep = 0;
            }
            this.lastAnimation = 'celebrate';
            image = AssetsManager.getWormTexture('celebrate');
        }

        if (wormStates.isDrown) {
            image = AssetsManager.getWormTexture('celebrate');
        }
        if (this.dead.isReady) {
            image = AssetsManager.getWormTexture('grave');
        }
        this.texture.repeat.x = -wormDirection;
        if (image) {
            this.maxSteps = image.naturalHeight / image.naturalWidth;

            const size = image.naturalWidth;
            if (this.canvas.width != size) {
                this.canvas.width = size;
                this.canvas.height = size;
            }

            if (this.currentStep >= this.maxSteps - 1) {
                this.animationDirection = -1;
            }
            if (this.currentStep <= 0) {
                this.animationDirection = 1;
            }

            this.currentStep += this.animationDirection;

            this.ctx?.clearRect(0, 0, size, size);
            this.ctx?.drawImage(image, 0, -this.currentStep * size);
        }
    };

    getTexture() {
        return this.texture;
    }
}
