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

    constructor() {
        this.texture.wrapS = RepeatWrapping;
        // this.texture.magFilter = NearestFilter;
    }
    getCanvas() {
        return this.canvas;
    }

    public spriteLoop = (wormStates: IWormMoveStates, wormDirection: number) => {
        this.texture.needsUpdate = true;

        let image = AssetsManager.getWormTexture('breath');
        if (Object.values(wormStates).every((value) => !value)) {
            this.lastAnimation = 'breath';
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

        this.texture.repeat.x = -wormDirection;
        if (image) {
            this.maxSteps = image.naturalHeight / image.naturalWidth;

            const size = image.naturalWidth;
            this.canvas.width = size;
            this.canvas.height = size;
            if (this.currentStep >= this.maxSteps - 1) {
                this.animationDirection = -1;
            }
            if (this.currentStep <= 0) {
                this.animationDirection = 1;
            }

            this.currentStep += this.animationDirection;

            this.ctx?.drawImage(image, 0, -this.currentStep * size);
        }
    };

    getTexture() {
        return this.texture;
    }
}
