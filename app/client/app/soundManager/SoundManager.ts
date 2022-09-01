import {
    ELang,
    ESoundsBG,
    ESoundsBullet,
    ESoundsFX,
    ESoundsWeapon,
    ESoundsWormAction,
    ESoundsWormSpeech,
} from '../../../ts/enums';

const prePath = process.env.NODE_ENV === 'development' ? '../../../client' : '.';

export default class SoundManager {
    static background = new Audio();
    static timer = new Audio();
    static worm = new Audio();
    static wormSpeech = new Audio();
    static weapon = new Audio();
    static bullet = new Audio();
    static sfx = new Audio();

    static pathToAudio = prePath + '/assets/sound';
    static extention = '.wav';
    static paths = {
        background: '/background/',
        weapon: '/weapon/',
        worm: '/worm/',
        bullet: '/bullet/',
        wormSpeech: '/user/speech/',
        sfx: '/sfx/',
    };
    constructor() {
        document.body.append(
            SoundManager.worm,
            SoundManager.background,
            SoundManager.sfx,
            SoundManager.timer,
            SoundManager.weapon,
            SoundManager.bullet,
            SoundManager.wormSpeech
        );
    }
    static playBackground(bg: ESoundsBG) {
        this.background.src = this.pathToAudio + this.paths.background + bg + this.extention;
        this.background.loop = true;
        this.background.play();
        // make autoplay;
    }

    static playSFX(state: ESoundsFX) {
        if (!this.sfx.paused) return;
        this.sfx.src = this.pathToAudio + this.paths.sfx + state + this.extention;
        this.sfx.play();
    }

    static playBullet(action: ESoundsBullet) {
        if (!this.bullet.paused) return;
        this.sfx.src = this.pathToAudio + this.paths.bullet + action + this.extention;
        this.sfx.play();
    }

    static playWeapon(action: ESoundsWeapon | ESoundsWormSpeech) {
        if (!this.weapon.paused) return;
        this.sfx.src = this.pathToAudio + this.paths.weapon + action + this.extention;
        this.sfx.play();
    }

    static playTimer(state: ESoundsFX) {
        if (!this.timer.paused) return;
        this.sfx.src = this.pathToAudio + this.paths.sfx + state + this.extention;
        this.sfx.play();
    }

    static playWormAction(action: ESoundsWormAction) {
        if (!this.worm.paused) return;
        this.worm.src = this.pathToAudio + this.paths.worm + action + this.extention;
        this.worm.play();
    }
    static playWormSpeech(lang: ELang, speech: ESoundsWormSpeech) {
        if (!this.worm.paused) return;
        this.worm.src = this.pathToAudio + this.paths.wormSpeech + lang + '/' + speech + this.extention;
        this.worm.play();
    }
}
