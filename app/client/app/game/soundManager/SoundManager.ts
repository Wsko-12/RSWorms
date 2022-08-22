import { IWormMoveStates } from '../../../../ts/interfaces';

export default class SoundManager {
    static lobby = new Audio();
    static background = new Audio();
    static worm = new Audio();
    static sfx = new Audio();
    static pathToAudio = '../../../client/assets/sound';
    constructor() {
        document.body.append(SoundManager.lobby, SoundManager.worm, SoundManager.background, SoundManager.sfx);
    }
    static playBackground() {
        this.background.src = this.pathToAudio + '/background/outerspace.wav';
        this.background.volume = 0.25;
        this.background.loop = true;
        this.background.play();
        // make autoplay;
    }

    static playSFX(state: string) {
        if (!this.sfx.paused) return;
        if (state === 'explosion') {
            this.sfx.src = this.pathToAudio + '/soundFX/explosion.wav';
        }
        // console.log(t)
        this.sfx.play();
    }

    static playWorm(state: string) {
        // this.worm.play();
        if (!this.worm.paused) return;
        if (state === 'walk') {
            this.worm.src = this.pathToAudio + '/soundFX/walk.wav';
        }
        if (state === 'jump1' || state === 'jump2') {
            this.worm.src = this.pathToAudio + '/user/speech/russian/' + state + '.wav';
        }
        if (state === 'shoot') {
            this.worm.src = this.pathToAudio + '/user/speech/russian/' + state + '.wav';
        }
        this.worm.play();
    }
}
