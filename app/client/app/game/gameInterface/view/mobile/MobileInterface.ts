import PageBuilder from '../../../../../utils/PageBuilder';
import JumpButton from './buttons/JumpButton';
import ShootButton from './buttons/ShootButton';
import Joystick from './joystick/Joystick';
import './style.scss';

export default class MobileInterface {
    private element: HTMLElement;
    private moveJoystick: Joystick;
    private shootButton: ShootButton;
    private jumpButton: JumpButton;
    constructor(eventsHandler: HTMLElement) {
        this.element = PageBuilder.createElement('section', {
            classes: 'mobile__interface',
        });
        this.moveJoystick = new Joystick(eventsHandler);

        const moveJoystickEl = this.moveJoystick.getElement();
        moveJoystickEl.style.bottom = '10px';
        moveJoystickEl.style.left = '10px';
        this.element.append(moveJoystickEl);

        this.shootButton = new ShootButton(eventsHandler);
        const shootBtnEl = this.shootButton.getElement();

        shootBtnEl.style.bottom = '15px';
        shootBtnEl.style.right = '10px';

        this.element.append(shootBtnEl);

        this.jumpButton = new JumpButton(eventsHandler);
        const jumpBtnEl = this.jumpButton.getElement();

        jumpBtnEl.style.bottom = '80px';
        jumpBtnEl.style.right = '10px';

        this.element.append(jumpBtnEl);
    }

    public getElement() {
        return this.element;
    }
}
