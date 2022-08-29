import PageBuilder from '../../../../../utils/PageBuilder';
import gameplayManager from '../../../gameplayManager/GameplayManager';
import Team from '../../../gameplayManager/team/Team';
import './style.scss';

export default class TeamsHP {
    private element: HTMLDivElement;
    private barScale = 0.5;
    private colors = ['red', 'blue', 'green', 'yellow'];
    private teams: {
        [key: string]: HTMLDivElement;
    } = {};
    constructor() {
        const container = <HTMLDivElement>PageBuilder.createElement('div', { classes: 'teams-hp-container' });
        this.element = container;
    }

    build = (teams: Team[]) => {
        teams.forEach((team, idx) => {
            const teamDiv = <HTMLDivElement>this.createTeamBar(team, this.colors[idx]);
            this.teams[team.name] = teamDiv;
            this.element.append(teamDiv);
        });
    };

    createTeamBar(team: Team, color: string) {
        const hpContainer = PageBuilder.createElement('div', { classes: 'hp-row-container' });
        const teamNameContainer = PageBuilder.createElement('div', { classes: 'team-name-container' });
        const teamHPContainer = PageBuilder.createElement('div', { classes: 'team-hp-container' });
        const teamName = PageBuilder.createElement('div', { classes: 'team-name' });
        teamName.style.color = color;
        teamName.innerHTML = team.name;
        teamName.id = team.name;
        const hpBar = PageBuilder.createElement('div', { classes: 'team-hp-bar' });
        hpBar.style.width = team.getHP() * this.barScale + 'px';
        hpBar.id = team.name;
        hpBar.style.backgroundColor = color;
        teamHPContainer.append(hpBar);
        teamNameContainer.append(teamName);

        hpContainer.append(teamNameContainer, teamHPContainer);
        return hpContainer;
    }

    public update = (teams: Team[]) => {
        teams.forEach((team) => {
            const teamEl = this.teams[team.name];
            const bar = teamEl.querySelector('.team-hp-bar') as HTMLElement;
            bar.style.width = team.getHP() * this.barScale + 'px';
            if (team.getHP() <= 0) teamEl.innerHTML = '';
        });
    };

    public getElement() {
        return this.element;
    }
}
