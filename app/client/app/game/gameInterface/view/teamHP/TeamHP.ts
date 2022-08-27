import PageBuilder from '../../../../../utils/PageBuilder';
import gameplayManager from '../../../gameplayManager/GameplayManager';
import Team from '../../../gameplayManager/team/Team';
import './style.scss';

export default class TeamsHP {
    private element: HTMLDivElement;
    // private teams: {
    //     [key: string]: HTMLDivElement;
    // };
    constructor() {
        const container = <HTMLDivElement>PageBuilder.createElement('div', { classes: 'teams-hp-container' });
        this.element = container;
    }


    public update = (teams: Team[]) => {};

    public getElement() {
        return this.element;
    }
}
