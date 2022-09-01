import { ELang, EMapPacksDecorItems, EMapPacksNames, EWorldSizes } from '../../../../../../ts/enums';
import { IStartGameOptions, ITeamOptions } from '../../../../../../ts/interfaces';
import { isMapTexturePack, isWorldSizesKey } from '../../../../../../ts/typeguards';
import { generateId, getRandomMemberName, getRandomTeamName } from '../../../../../utils/names';
import PageBuilder from '../../../../../utils/PageBuilder';
import PageElement from '../../../../../utils/PageElement';
import NumberSwitcher from './numberSwitcher/NumberSwitcher';
import StringSwitcher from './stringSwitcher/StringSwitcher';
import './style.scss';
export default class GameCreator extends PageElement {
    protected element: HTMLDivElement;
    protected body: HTMLDivElement;
    private isOnline: boolean;
    private currentId: string;
    private idElement: HTMLParagraphElement;
    private start: HTMLDivElement;
    private elements = {
        time: new NumberSwitcher('Round time', 15, 60, 5, 45),
        teams: new NumberSwitcher('Teams', 2, 4, 1, 2),
        worms: new NumberSwitcher('Worms', 1, 6, 1, 3),
        hp: new NumberSwitcher('Start HP', 20, 300, 20, 100),
        mapSize: new StringSwitcher(
            'Map size',
            Object.keys(EWorldSizes).filter((value) => isNaN(Number(value))),
            1
        ),
        texture: new StringSwitcher('Texture pack', Object.keys(EMapPacksNames)),
    };
    private counters = {
        teams: 2,
        worms: 4,
        wormsHealth: 100,
        time: 45,
        mapSize: EWorldSizes.small,
        texture: EMapPacksNames.moon,
    };

    private submitCb: (options: IStartGameOptions) => void;

    constructor(online: boolean, submitCb: (options: IStartGameOptions) => void) {
        super();
        this.submitCb = submitCb;
        this.isOnline = online;
        this.element = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__pop-up__overlay game-creator__overlay',
        });

        this.body = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'lobby__pop-up game-creator',
        });

        this.element.append(this.body);
        this.element.style.zIndex = '2';

        this.currentId = generateId();

        this.idElement = <HTMLParagraphElement>PageBuilder.createElement('p', {
            classes: 'game-creator__id',
        });

        if (!this.isOnline) {
            this.idElement.style.display = 'none';
        }
        this.body.append(this.idElement);
        Object.values(this.elements).forEach((element) => {
            this.body.append(element.getElement());
        });

        const start = <HTMLDivElement>PageBuilder.createElement('div', {
            classes: 'game-creator__start lobby__button',
            content: online ? 'create' : 'start',
        });

        this.start = start;
        this.show(false);
        this.body.append(start);

        this.applyEvents();
    }

    private updateCounters() {
        this.counters.time = this.elements.time.getValue();
        this.counters.teams = this.elements.teams.getValue();
        this.counters.worms = this.elements.worms.getValue();
        this.counters.wormsHealth = this.elements.hp.getValue();

        const size = this.elements.mapSize.getValue();

        if (isWorldSizesKey(size)) {
            const mapSize = EWorldSizes[size];
            this.counters.mapSize = mapSize;
        }

        const texture = this.elements.texture.getValue();
        if (isMapTexturePack(texture)) {
            this.counters.texture = EMapPacksNames[texture];
        }
    }

    private applyEvents() {
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.show(false);
            }
        });

        this.start.addEventListener('click', () => {
            this.updateCounters();

            const generateTeams = (): ITeamOptions[] => {
                const teams: ITeamOptions[] = [];
                for (let i = 0; i < this.counters.teams; i++) {
                    const team = {
                        name: getRandomTeamName(),
                        worms: new Array(this.counters.worms).fill(1).map(() => getRandomMemberName()),
                        lang: ELang.eng,
                    };
                    teams.push(team);
                }
                return teams;
            };

            const options: IStartGameOptions = {
                seed: Math.random(),
                mapTexturePackName: this.counters.texture,
                decor: {
                    count: EMapPacksDecorItems[this.counters.texture],
                    max: 6,
                    min: 2,
                },
                time: this.counters.time,
                worldSize: this.counters.mapSize,
                multiplayer: this.isOnline,
                wormsCount: this.counters.worms,
                hp: this.counters.wormsHealth,
                teams: this.isOnline ? this.counters.teams : generateTeams(),
            };

            this.submitCb(options);
        });
    }

    public show(flag: boolean) {
        this.currentId = generateId();

        this.idElement.innerHTML = this.currentId;
        this.element.style.display = flag ? 'flex' : 'none';
    }
}
