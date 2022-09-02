import { getRandomMemberName } from '../../../../client/utils/names';
import { ELang, EMapPacksDecorItems, EMapPacksNames } from '../../../../ts/enums';
import { IServerGameOptions, ITeamOptions } from '../../../../ts/interfaces';
import {
    ESocketGameMessages,
    ILoadingMultiplayerGameData,
    ISocketRoomsTableDataItem,
} from '../../../../ts/socketInterfaces';
import ManagerItem from '../ManagerItem';
import User from '../userManager/User';
import UserManager from '../userManager/UserManager';

export default class Game extends ManagerItem {
    private users: User[] = [];
    public id: string;
    private playersLoadedGameStates: Record<string, boolean> = {};
    private started = false;
    constructor(options: ISocketRoomsTableDataItem) {
        super();
        const userManager = new UserManager();
        options.players.forEach((name) => {
            this.playersLoadedGameStates[name] = false;

            const user = userManager.getUserByName(name);
            if (user) {
                user.setGame(this.id);
                this.users.push(user);
            }
        });

        this.id = options.id;

        const loadingGameData = this.generateLoadingGameData(options);

        this.sendAll(ESocketGameMessages.startLoading, loadingGameData);
    }

    private generateLoadingGameData(options: ISocketRoomsTableDataItem): ILoadingMultiplayerGameData {
        const teams: ITeamOptions[] = options.players.map((name) => ({
            lang: ELang.eng,
            worms: new Array(options.worms).fill(0).map(() => getRandomMemberName()),
            name,
        }));

        return {
            ...options,
            multiplayer: true,
            seed: Math.random(),
            decor: {
                count: EMapPacksDecorItems[options.texture],
                max: 6,
                min: 2,
            },
            teams,
        };
    }

    private checkPlayerLoadedStates() {
        if (!this.started) {
            const allPlayersLoadedGame = Object.values(this.playersLoadedGameStates).every((state) => state);
            if (allPlayersLoadedGame) {
                this.start();
            }
        }
    }

    public sendAll<T>(msg: string, data?: T) {
        this.users.forEach((user) => {
            user.emit(msg, data);
        });
    }

    private start() {
        this.users.forEach((user) => {
            const data = {
                multiplayer: true,
                id: this.id,
            };

            user.emit(ESocketGameMessages.startGame, data);
        });
    }

    public removeUser(name: string) {
        const index = this.users.findIndex((user) => user.name === name);
        if (index != -1) {
            const user = this.users[index];
            this.users.splice(index, 1);
            delete this.playersLoadedGameStates[name];
            this.checkPlayerLoadedStates();
        }
        if (this.users.length <= 0) {
            this.removeFromManager();
        }
    }
}
